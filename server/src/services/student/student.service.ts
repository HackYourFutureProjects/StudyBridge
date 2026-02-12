import { inject, injectable } from "inversify";
import { StudentCommand } from "../../repositories/commandRepositories/student.command.js";
import { TYPES } from "../../composition/composition.types.js";
import { StudentRegistrationType } from "../../types/student/student.types.js";
import { StudentTypeDB } from "../../db/schemes/types/student.types.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { studentMapper } from "../../utils/mappers/student.mapper.js";
import { HttpError, NotFoundError } from "../../utils/error.util.js";
import { StudentQuery } from "../../repositories/queryRepositories/student.query.js";
import { TeacherQuery } from "../../repositories/queryRepositories/teacher.query.js";
import { isMongoDuplicateKeyError } from "../../utils/duplicateType.guard.js";
@injectable()
export class StudentService {
  constructor(
    @inject(TYPES.StudentCommand) private studentCommand: StudentCommand,
    @inject(TYPES.StudentQuery) private studentQuery: StudentQuery,
    @inject(TYPES.TeacherQuery) private teacherQuery: TeacherQuery,
  ) {}

  async createStudent({
    firstName,
    email,
    lastName,
    password,
    role,
  }: StudentRegistrationType) {
    const studentExists = await this.studentQuery.getStudentByEmail(email);
    const teacherExists = await this.teacherQuery.getTeacherByEmail(email);

    if (studentExists || teacherExists) {
      throw new HttpError(409, "Email already registered");
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const newStudent: StudentTypeDB = {
      id: randomUUID(),
      firstName,
      lastName,
      email,
      passwordHash,
      passwordSalt,
      passwordReset: {
        tokenHash: null,
        expiresAt: null,
      },
      address: null,
      createdAt: new Date(),
      profileImageUrl: null,
      mainLanguage: null,
      role,
    };
    try {
      const student = await this.studentCommand.createStudent(newStudent);
      return studentMapper(student);
    } catch (e: unknown) {
      if (isMongoDuplicateKeyError(e)) {
        throw new HttpError(409, "Email already registered");
      }
      throw e;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    const deleted = await this.studentCommand.deleteStudent(id);

    if (!deleted) {
      throw new NotFoundError("Student not found", { id });
    }
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
