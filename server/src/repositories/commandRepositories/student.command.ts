import { injectable } from "inversify";
import { StudentTypeDB } from "../../db/schemes/types/student.types.js";
import { StudentModel } from "../../db/schemes/studentSchema.js";
import { HttpError } from "../../utils/error.util.js";

@injectable()
export class StudentCommand {
  async createStudent(newStudent: StudentTypeDB) {
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
}
