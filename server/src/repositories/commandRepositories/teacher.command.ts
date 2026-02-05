import { injectable } from "inversify";
import { TeacherTypeDB } from "../../db/schemes/types/teacher.types.js";
import { TeacherModel } from "../../db/schemes/teacherSchema.js";
import { HttpError } from "../../utils/error.util.js";

@injectable()
export class TeacherCommand {
  async createTeacher(newTeacher: TeacherTypeDB) {
    try {
      const created = await TeacherModel.create(newTeacher);
      return created.toObject();
    } catch (err: unknown) {
      throw new HttpError(500, "Teacher was not created", { cause: err });
    }
  }

  async deleteTeacher(id: string) {
    try {
      const deleted = await TeacherModel.deleteOne({ id });
      return deleted.deletedCount === 1;
    } catch (err: unknown) {
      throw new HttpError(500, "Teacher was not deleted", { cause: err, id });
    }
  }
}
