import { inject, injectable } from "inversify";
import {
  ParamsType,
  RequestWithParams,
  RequestWithQuery,
  ResponseWithData,
  RequestWithBody,
} from "../types/common.types.js";
import { NextFunction, Response } from "express";
import { TYPES } from "../composition/composition.types.js";
import { TeacherService } from "../services/teacher/teacher.service.js";
import { TeacherQuery } from "../repositories/queryRepositories/teacher.query.js";
import {
  AddSlotsBody,
  AvailabilityView,
  DayParam,
  QueryTeacherInput,
  TeacherOutputModel,
} from "../types/teacher/teacher.types.js";

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

      const teachers = await this.teacherQuery.getAllTeachers(sortData);

      return res.status(200).send(teachers);
    } catch (err) {
      return next(err);
    }
  }

  async addSlotsToSchedule(
    req: RequestWithParams<DayParam> & RequestWithBody<AddSlotsBody>, // user can send 1 slot, 2 slots, or more in one request.
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teacherId = req.auth?.userId;

      if (!teacherId) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      const { slots, timezone } = req.body;
      const day = req.params.day;

      const addedTimeslot = await this.teacherQuery.addSlotsToSchedule(
        teacherId,
        day,
        slots,
        timezone,
      );

      if (!addedTimeslot) return res.sendStatus(404);

      return res.status(200).send(addedTimeslot);
    } catch (err) {
      return next(err);
    }
  }

  //get teacher availability for a specific day, if day query is "all", get availability for all days of the week
  async getTeacherAvailability(
    req: RequestWithQuery<{ day: keyof AvailabilityView | "all" }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teacherId = req.auth?.userId;
      if (!teacherId) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      const day = req.query.day;

      const availability = await this.teacherQuery.getTeacherAvailability(
        teacherId,
        day,
      );

      if (!availability)
        return res.status(404).json({ message: "Teacher not found" });

      return res.status(200).json(availability);
    } catch (error) {
      return next(error);
    }
  }
}
