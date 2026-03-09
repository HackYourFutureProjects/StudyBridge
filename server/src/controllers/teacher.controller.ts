import { inject, injectable } from "inversify";
import {
  ParamsType,
  RequestWithParams,
  RequestWithQuery,
  ResponseWithData,
  RequestWithBody,
} from "../types/common.types.js";
import { NextFunction, Request, Response } from "express";
import { TYPES } from "../composition/composition.types.js";
import { TeacherService } from "../services/teacher/teacher.service.js";
import { TeacherQuery } from "../repositories/queryRepositories/teacher.query.js";
import {
  ReplaceWeekAvailabilityBody,
  QueryTeacherInput,
  TeacherOutputModel,
  UpdateTeacherProfileInput,
  QueryTeacherForModeratorInput,
  UpdateTeacherVisibilityInput,
} from "../types/teacher/teacher.types.js";
import { validateAuthorization } from "../utils/validation/requestValidation.util.js";

@injectable()
export class TeacherController {
  constructor(
    @inject(TYPES.TeacherService) private teacherService: TeacherService,
    @inject(TYPES.TeacherQuery) private teacherQuery: TeacherQuery,
  ) {}

  async deleteTeacher(
    req: RequestWithParams<ParamsType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await this.teacherService.deleteTeacher(req.params.id);
      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  }

  async getAllTeachers(
    req: RequestWithQuery<QueryTeacherInput>,
    res: ResponseWithData<TeacherOutputModel>,
    next: NextFunction,
  ) {
    try {
      const sortData: QueryTeacherInput = {
        subject: req.query.subject,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        minRating: req.query.minRating,
        maxRating: req.query.maxRating,
      };

      const teachers = await this.teacherQuery.getAllActiveTeachers(sortData);

      return res.status(200).send(teachers);
    } catch (err) {
      return next(err);
    }
  }

  async getAllTeachersForModerator(
    req: RequestWithQuery<QueryTeacherForModeratorInput>,
    res: ResponseWithData<TeacherOutputModel>,
    next: NextFunction,
  ) {
    try {
      const sortData: QueryTeacherForModeratorInput = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        status: req.query.status,
      };

      const teachers =
        await this.teacherQuery.getAllTeachersForModerator(sortData);

      return res.status(200).send(teachers);
    } catch (err) {
      return next(err);
    }
  }

  async getTeacherById(
    req: RequestWithParams<ParamsType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teacher = await this.teacherQuery.getTeacherById(req.params.id);

      if (!teacher || teacher.status !== "active") {
        return res.status(404).json({ message: "Teacher not found" });
      }

      return res.status(200).json(teacher);
    } catch (err) {
      return next(err);
    }
  }

  async getTeacherByIdForModerator(
    req: RequestWithParams<ParamsType>,
    res: Response,
    next: NextFunction,
  ) {
    const { id } = req.params;

    try {
      const teacher = await this.teacherQuery.getTeacherById(id);

      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      return res.status(200).json(teacher);
    } catch (err) {
      return next(err);
    }
  }

  async getMyWeeklyAvailability(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teacherId = validateAuthorization(req.auth?.userId);
      const availability =
        await this.teacherQuery.findTeacherWeeklyAvailability(teacherId);

      if (!availability)
        return res.status(404).json({ message: "Teacher not found" });

      return res.status(200).json(availability);
    } catch (error) {
      return next(error);
    }
  }

  async replaceAvailabilityForWeek(
    req: RequestWithBody<ReplaceWeekAvailabilityBody>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teacherId = validateAuthorization(req.auth?.userId);
      const { availability, timezone } = req.body;
      const updated = await this.teacherQuery.replaceAvailabilityForWeek(
        teacherId,
        availability,
        timezone,
      );

      if (!updated) return res.sendStatus(404);

      const teacher = await this.teacherQuery.getTeacherById(teacherId);
      // If teacher removes all schedule slots, auto-switch to private draft.
      if (teacher && !this.isProfileComplete(teacher)) {
        await this.teacherService.updateTeacherVisibility({
          teacherId,
          isPublic: false,
        });
      }

      return res.status(200).json(updated);
    } catch (err) {
      return next(err);
    }
  }

  async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const teacherId = validateAuthorization(req.auth?.userId);
      const teacher = await this.teacherQuery.getTeacherById(teacherId);

      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      return res.status(200).json(teacher);
    } catch (err) {
      return next(err);
    }
  }

  async updateMyProfile(
    req: RequestWithBody<UpdateTeacherProfileInput>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teacherId = validateAuthorization(req.auth?.userId);
      const updatedTeacher = await this.teacherQuery.updateMyProfile(
        teacherId,
        req.body,
      );

      if (!updatedTeacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      if (!this.isProfileComplete(updatedTeacher)) {
        // If profile becomes incomplete, force private + draft.
        await this.teacherService.updateTeacherVisibility({
          teacherId,
          isPublic: false,
        });

        // Re-fetch to return the final persisted state (status/isPublic included).
        const refreshedTeacher =
          await this.teacherQuery.getTeacherById(teacherId);
        if (!refreshedTeacher) {
          return res.status(404).json({ message: "Teacher not found" });
        }
        return res.status(200).json(refreshedTeacher);
      }

      // Profile is complete, so the updated profile snapshot is already valid.
      return res.status(200).json(updatedTeacher);
    } catch (err) {
      return next(err);
    }
  }

  async updateMyVisibility(
    req: RequestWithBody<UpdateTeacherVisibilityInput>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teacherId = validateAuthorization(req.auth?.userId);
      const { isPublic } = req.body;
      // Teacher controls publish intent; service enforces completeness rules.
      await this.teacherService.updateTeacherVisibility({
        teacherId,
        isPublic,
      });
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }

  private isProfileComplete(teacher: {
    subjects: unknown[];
    availability: Record<string, { start: string; end: string }[]>;
  }) {
    // complete profile means at least one subject and one schedule slot.
    const hasSubjects = teacher.subjects.length > 0;
    const hasSchedule = Object.values(teacher.availability).some(
      (slots) => slots.length > 0,
    );
    return hasSubjects && hasSchedule;
  }
}
