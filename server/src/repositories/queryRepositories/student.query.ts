import { injectable } from "inversify";
import { StudentViewType } from "../../types/student/student.types.js";
import { StudentModel } from "../../db/schemes/studentSchema.js";
import { studentMapper } from "../../utils/mappers/student.mapper.js";

@injectable()
export class StudentQuery {
  async getStudentByEmail(email: string): Promise<StudentViewType | null> {
    try {
      const student = await StudentModel.findOne({ email }).lean();
      if (!student) {
        return null;
      }
      return studentMapper(student);
    } catch (err: unknown) {
      throw new Error("Something went wrong with student search", {
        cause: err,
      });
    }
  }

  async getStudentById(id: string): Promise<StudentViewType | null> {
    try {
      const student = await StudentModel.findOne({ id }).lean();
      if (!student) {
        return null;
      }
      return studentMapper(student);
    } catch (err: unknown) {
      throw new Error("Something went wrong with student search", {
        cause: err,
      });
    }
  }

  async findUserByEmailWithHash(email: string) {
    try {
      const user = await StudentModel.findOne({ email }).lean();
      if (!user) {
        return null;
      }
      return user;
    } catch (err: unknown) {
      throw new Error("Something went wrong with student search", {
        cause: err,
      });
    }
  }
}
