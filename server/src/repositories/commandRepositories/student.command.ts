import { injectable } from "inversify";
import { StudentTypeDB } from "../../db/schemes/types/student.types.js";
import { StudentModel } from "../../db/schemes/studentSchema.js";
import { HttpError } from "../../utils/error.util.js";
import { isMongoDuplicateKeyError } from "../../utils/duplicateType.guard.js";
import {
  CreateGoogleStudent,
  CreateLocalStudent,
} from "../../types/student/student.types.js";

@injectable()
export class StudentCommand {
  async createStudent(newStudent: CreateLocalStudent | CreateGoogleStudent) {
    try {
      const created = await StudentModel.create(newStudent);
      return created.toObject();
    } catch (err: unknown) {
      throw new HttpError(500, "Student was not created", { cause: err });
    }
  }

  async deleteStudent(id: string) {
    try {
      const deleted = await StudentModel.deleteOne({ id });
      return deleted.deletedCount === 1;
    } catch (err: unknown) {
      throw new HttpError(500, "Student was not deleted", { cause: err, id });
    }
  }

  async updatePasswordResetToken(
    studentId: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    try {
      const updated = await StudentModel.updateOne(
        { id: studentId },
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
    studentId: string,
    passwordHash: string,
    passwordSalt: string,
  ) {
    try {
      const updated = await StudentModel.updateOne(
        { id: studentId },
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
      throw new HttpError(500, "Password was not updated", {
        cause: err,
      });
    }
  }

  async updateStudent(id: string, data: Partial<StudentTypeDB>) {
    try {
      return await StudentModel.findOneAndUpdate(
        { id },
        { $set: data },
        { new: true },
      ).lean();
    } catch (err: unknown) {
      if (isMongoDuplicateKeyError(err)) {
        throw new HttpError(409, "Email already registered", {
          cause: err,
          id,
        });
      }
      throw new HttpError(500, "Student was not updated", { cause: err, id });
    }
  }

  async updatePassword(
    studentId: string,
    passwordHash: string,
    passwordSalt: string,
  ) {
    try {
      const updated = await StudentModel.updateOne(
        { id: studentId },
        { $set: { passwordHash, passwordSalt } },
      );
      return updated.matchedCount === 1;
    } catch (error) {
      throw new HttpError(500, "Password was not updated", { cause: error });
    }
  }
}
