import { inject, injectable } from "inversify";
import { StudentCommand } from "../../repositories/commandRepositories/student.command.js";
import { TYPES } from "../../composition/composition.types.js";
import { StudentRegistrationType } from "../../types/student/student.types.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { StudentTypeDB } from "../../db/schemes/types/student.types.js";
import { studentMapper } from "../../utils/mappers/student.mapper.js";
@injectable()
export class StudentService {
  constructor(
    @inject(TYPES.StudentCommand) private studentCommand: StudentCommand,
  ) {}

  async createStudent({
    firstName,
    email,
    lastName,
    password,
    role,
  }: StudentRegistrationType) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const newStudent: StudentTypeDB = {
      id: randomUUID(),
      firstName,
      lastName,
      email,
      passwordHash,
      passwordSalt,
      address: null,
      createdAt: new Date(),
      profileImageUrl: null,
      mainLanguage: null,
      role,
    };
    const student = await this.studentCommand.createStudent(newStudent);

    return studentMapper(student);
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
