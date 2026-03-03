import { injectable } from "inversify";
import {
  QueryTeacherInput,
  TeacherOutputModel,
  TeacherViewType,
  AvailabilityView,
  UpdateTeacherProfileInput,
  QueryTeacherForModeratorInput,
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

  async getAllTeachersForModerator(
    queries: QueryTeacherForModeratorInput,
  ): Promise<TeacherOutputModel> {
    try {
      const pageNumber = queries.pageNumber ?? 1;
      const pageSize = queries.pageSize ?? 10;
      const sortBy = queries.sortBy ?? "createdAt";
      const sortDirection = queries.sortDirection ?? "desc";

      const items = await TeacherModel.find()
        .sort(filterForSort(sortBy, sortDirection))
        .skip((pageNumber - 1) * +pageSize)
        .limit(+pageSize)
        .lean();

      const totalCount = await TeacherModel.countDocuments();

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

  async getTeachersByIds(ids: string[]) {
    try {
      if (ids.length === 0) {
        return [];
      }
      const teachers = await TeacherModel.find({ id: { $in: ids } }).lean();
      return teachers.map(teacherMapper);
    } catch (err: unknown) {
      throw new Error("Something went wrong with getting teachersByIds", {
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

  async replaceAvailabilityForWeek(
    teacherId: string,
    availability: AvailabilityView,
    timezone?: string,
  ): Promise<AvailabilityView | null> {
    try {
      const updatedTeacher = await TeacherModel.findOneAndUpdate(
        { id: teacherId },
        {
          $set: {
            availability,
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

      return updatedTeacher.availability;
    } catch (err: unknown) {
      throw new Error(
        "Something went wrong with replacing weekly availability",
        {
          cause: err,
        },
      );
    }
  }

  async findTeacherWeeklyAvailability(
    teacherId: string,
  ): Promise<AvailabilityView | null> {
    try {
      const teacherTimeslots = await TeacherModel.findOne(
        { id: teacherId },
        { availability: 1, _id: 0 },
      ).lean();

      if (!teacherTimeslots) return null;
      return teacherTimeslots.availability;
    } catch (err: unknown) {
      throw new Error(
        "Something went wrong while fetching teacher availability",
        {
          cause: err,
        },
      );
    }
  }

  async updateMyProfile(
    teacherId: string,
    updates: UpdateTeacherProfileInput,
  ): Promise<TeacherViewType | null> {
    try {
      const updateFields: Record<string, unknown> = {};

      if (updates.firstName !== undefined)
        updateFields.firstName = updates.firstName;
      if (updates.lastName !== undefined)
        updateFields.lastName = updates.lastName;
      if (updates.phoneNumber !== undefined)
        updateFields.phoneNumber = updates.phoneNumber;
      if (updates.experience !== undefined)
        updateFields.experience = updates.experience;
      if (updates.bio !== undefined) updateFields.bio = updates.bio;
      if (updates.profileImageUrl !== undefined)
        updateFields.profileImageUrl = updates.profileImageUrl;
      if (updates.education !== undefined)
        updateFields.education = updates.education;
      if (updates.subjects !== undefined)
        updateFields.subjects = updates.subjects;

      if (updates.subjects) {
        updateFields.priceFrom = Math.min(
          ...updates.subjects.map((s) => s.hourlyRate),
        );
      }

      const updatedTeacher = await TeacherModel.findOneAndUpdate(
        { id: teacherId },
        { $set: updateFields },
        { new: true, lean: true },
      );

      if (!updatedTeacher) return null;

      return teacherMapper(updatedTeacher);
    } catch (err: unknown) {
      throw new Error("Something went wrong with updating teacher profile", {
        cause: err,
      });
    }
  }

  async findTeacherByIdWithHash(id: string) {
    try {
      const user = await TeacherModel.findOne({ id }).lean();
      return user || null;
    } catch (err: unknown) {
      throw new Error("Something went wrong with teacher search", {
        cause: err,
      });
    }
  }
}
