import { injectable } from "inversify";
import { TeacherTypeDB } from "../../db/schemes/types/teacher.types.js";
import { TeacherModel } from "../../db/schemes/teacherSchema.js";

@injectable()
export class TeacherCommand {
  async createTeacher(newTeacher: TeacherTypeDB) {
    try {
      const created = await TeacherModel.create(newTeacher);
      return created.toObject();
    } catch (err: unknown) {
      throw new Error("Teacher was not created", { cause: err });
    }
  }
}
