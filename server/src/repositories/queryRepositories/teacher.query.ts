import { injectable } from "inversify";
import {
  QueryTeacherInput,
  TeacherOutputModel,
  TeacherViewType,
  AvailabilityView,
  TimeSlotView,
} from "../../types/teacher/teacher.types.js";
import { TeacherModel } from "../../db/schemes/teacherSchema.js";
import { teacherMapper } from "../../utils/mappers/teacher.mapper.js";
import { filterForSort } from "../../utils/filterSort.js";
import { buildTeacherFilter } from "../../utils/teachersFilter.js";

@injectable()
export class TeacherQuery {
  async getAllTeachers(
    queries: QueryTeacherInput,
  ): Promise<TeacherOutputModel> {
    try {
      const pageNumber = queries.pageNumber ?? 1;
      const pageSize = queries.pageSize ?? 10;
      const sortBy = queries.sortBy ?? "createdAt";
      const sortDirection = queries.sortDirection ?? "desc";
      const filter = buildTeacherFilter(queries);

      const items = await TeacherModel.find(filter)
        .sort(filterForSort(sortBy, sortDirection))
        .skip((pageNumber - 1) * +pageSize)
        .limit(+pageSize)
        .lean();

      const totalCount = await TeacherModel.countDocuments(filter);

      const pagesCount = Math.ceil(totalCount / +pageSize);

      return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: items.map(teacherMapper),
      };
    } catch (err: unknown) {
      throw new Error("Something went wrong with getting all teachers", {
        cause: err,
      });
    }
  }

  async getTeacherByEmail(email: string): Promise<TeacherViewType | null> {
    try {
      const teacher = await TeacherModel.findOne({ email }).lean();
      if (!teacher) {
        return null;
      }
      return teacherMapper(teacher);
    } catch (err: unknown) {
      throw new Error("Something went wrong with teacher search", {
        cause: err,
      });
    }
  }

  async getTeacherById(id: string): Promise<TeacherViewType | null> {
    try {
      const teacher = await TeacherModel.findOne({ id }).lean();
      if (!teacher) {
        return null;
      }
      return teacherMapper(teacher);
    } catch (err: unknown) {
      throw new Error("Something went wrong with teacher search", {
        cause: err,
      });
    }
  }

  async findTeacherByEmailWithHash(email: string) {
    try {
      const teacher = await TeacherModel.findOne({ email }).lean();
      if (!teacher) {
        return null;
      }
      return teacher;
    } catch (err: unknown) {
      throw new Error("Something went wrong with teacher search", {
        cause: err,
      });
    }
  }

  async findTeacherByResetTokenHash(resetTokenHash: string) {
    try {
      const teacher = await TeacherModel.findOne({
        "passwordReset.tokenHash": resetTokenHash,
        "passwordReset.expiresAt": { $gt: new Date() },
      }).lean();

      if (!teacher) return null;
      return teacher;
    } catch (err: unknown) {
      throw new Error("Something went wrong with teacher search", {
        cause: err,
      });
    }
  }

  async addSlotsToSchedule(
    teacherId: string,
    day: keyof AvailabilityView,
    slots: TimeSlotView[],
    timezone?: string,
  ): Promise<TimeSlotView[] | null> {
    try {
      const updatedTeacher = await TeacherModel.findOneAndUpdate(
        { id: teacherId },
        {
          $set: {
            [`availability.${day}`]: slots,
            ...(timezone ? { timezone } : {}),
          },
        },
        {
          new: true,
          projection: { availability: 1, _id: 0 },
          lean: true,
        },
      );

      if (!updatedTeacher) return null;

      return updatedTeacher.availability[day];
    } catch (err: unknown) {
      throw new Error("Something went wrong with adding slots to schedule", {
        cause: err,
      });
    }
  }

  async getTeacherAvailability(
    teacherId: string,
    day: keyof AvailabilityView | "all",
  ): Promise<TimeSlotView[] | AvailabilityView | null> {
    try {
      const teacherTimeslots = await TeacherModel.findOne(
        { id: teacherId },
        { availability: 1, _id: 0 },
      ).lean();

      if (!teacherTimeslots) return null;
      if (day === "all") return teacherTimeslots.availability;

      return teacherTimeslots.availability[day];
    } catch (err: unknown) {
      throw new Error("Something went wrong with teacher time slots fetch", {
        cause: err,
      });
    }
  }
}
