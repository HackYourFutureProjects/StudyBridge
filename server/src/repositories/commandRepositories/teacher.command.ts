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

  async updatePasswordResetToken(
    teacherId: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    try {
      const updated = await TeacherModel.updateOne(
        { id: teacherId },
        {
          passwordReset: {
            tokenHash,
            expiresAt,
          },
        },
      );

      return updated.modifiedCount === 1;
    } catch (err: unknown) {
      throw new HttpError(500, "Password reset token was not updated", {
        cause: err,
      });
    }
  }

  async updatePasswordAndClearResetToken(
    teacherId: string,
    passwordHash: string,
    passwordSalt: string,
  ) {
    try {
      const updated = await TeacherModel.updateOne(
        { id: teacherId },
        {
          $set: {
            passwordHash,
            passwordSalt,
            "passwordReset.tokenHash": null,
            "passwordReset.expiresAt": null,
          },
        },
      );

      return updated.modifiedCount === 1;
    } catch (err: unknown) {
      throw new HttpError(500, "Password was not updated", { cause: err });
    }
  }
}
