import { injectable } from "inversify";
import { StudentTypeDB } from "../../db/schemes/types/student.types.js";
import { StudentModel } from "../../db/schemes/studentSchema.js";

@injectable()
export class StudentCommand {
  async createStudent(newStudent: StudentTypeDB) {
    try {
      const created = await StudentModel.create(newStudent);
      return created.toObject();
    } catch (err: unknown) {
      throw new Error("Student was not created", { cause: err });
    }
  }
}
