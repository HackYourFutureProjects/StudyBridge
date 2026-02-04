import { injectable } from "inversify";
import { StudentTypeDB } from "../../db/schemes/types/student.types.js";
import { StudentModel } from "../../db/schemes/studentSchema.js";

@injectable()
export class StudentCommand {
  async createStudent(newStudent: StudentTypeDB) {
    try {
      await StudentModel.create(newStudent);

      const findUser = await StudentModel.findOne({ id: newStudent.id }).lean();
      return findUser ?? null;
    } catch (err: unknown) {
      throw new Error("Student was not created", { cause: err });
    }
  }
}
