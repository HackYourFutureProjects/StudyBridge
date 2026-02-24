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
import { TeacherCommand } from "../../repositories/commandRepositories/teacher.command.js";
@injectable()
export class StudentService {
  constructor(
    @inject(TYPES.StudentCommand) private studentCommand: StudentCommand,
    @inject(TYPES.StudentQuery) private studentQuery: StudentQuery,
    @inject(TYPES.TeacherQuery) private teacherQuery: TeacherQuery,
    @inject(TYPES.TeacherCommand) private teacherCommand: TeacherCommand,
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

  async getStudentById(id: string) {
    return await this.studentQuery.getStudentById(id);
  }

  async updateStudentProfile(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      profileImageUrl?: string;
    },
  ) {
    const updateData: Partial<StudentTypeDB> = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;

    if (data.email !== undefined) {
      const existingStudent = await this.studentQuery.getStudentByEmail(
        data.email,
      );
      const existingTeacher = await this.teacherQuery.getTeacherByEmail(
        data.email,
      );

      if ((existingStudent && existingStudent.id !== id) || existingTeacher) {
        throw new HttpError(409, "Email already registered");
      }
      updateData.email = data.email;
    }

    if (data.profileImageUrl !== undefined)
      updateData.profileImageUrl = data.profileImageUrl;

    const updated = await this.studentCommand.updateStudent(id, updateData);
    if (!updated) {
      return null;
    }

    return studentMapper(updated);
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
