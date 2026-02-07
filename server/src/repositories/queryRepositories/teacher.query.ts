import { injectable } from "inversify";
import { TeacherViewType } from "../../types/teacher/teacher.types.js";
import { TeacherModel } from "../../db/schemes/teacherSchema.js";
import { teacherMapper } from "../../utils/mappers/teacher.mapper.js";

@injectable()
export class TeacherQuery {
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
}
