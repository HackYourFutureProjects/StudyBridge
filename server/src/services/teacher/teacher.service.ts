import { inject, injectable } from "inversify";
import { TeacherCommand } from "../../repositories/commandRepositories/teacher.command.js";
import { TYPES } from "../../composition/composition.types.js";
import { TeacherRegistrationType } from "../../types/teacher/teacher.types.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { TeacherTypeDB } from "../../db/schemes/types/teacher.types.js";
import { teacherMapper } from "../../utils/mappers/teacher.mapper.js";
import { HttpError, NotFoundError } from "../../utils/error.util.js";
import { StudentQuery } from "../../repositories/queryRepositories/student.query.js";
import { TeacherQuery } from "../../repositories/queryRepositories/teacher.query.js";
import { isMongoDuplicateKeyError } from "../../utils/duplicateType.guard.js";

@injectable()
export class TeacherService {
  constructor(
    @inject(TYPES.TeacherCommand) private teacherCommand: TeacherCommand,
    @inject(TYPES.StudentQuery) private studentQuery: StudentQuery,
    @inject(TYPES.TeacherQuery) private teacherQuery: TeacherQuery,
  ) {}

  async createTeacher({
    firstName,
    email,
    lastName,
    password,
    role,
  }: TeacherRegistrationType) {
    const studentExists = await this.studentQuery.getStudentByEmail(email);
    const teacherExists = await this.teacherQuery.getTeacherByEmail(email);

    if (studentExists || teacherExists) {
      throw new HttpError(409, "Email already registered");
    }

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);

    const newTeacher: TeacherTypeDB = {
      id: randomUUID(),
      firstName,
      lastName,
      email,
      passwordHash,
      passwordSalt,

      profileImageUrl: null,
      experience: 0,
      bio: null,
      headline: null,
      phoneNumber: null,
      dateOfBirth: null,
      gender: null,
      mainLanguage: null,

      education: [],
      subjects: [],
      availability: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },

      address: {
        street: null,
        city: null,
        state: null,
        zipCode: null,
        country: null,
      },

      createdAt: new Date(),

      role,
    };

    try {
      const teacher = await this.teacherCommand.createTeacher(newTeacher);
      return teacherMapper(teacher);
    } catch (e: unknown) {
      if (isMongoDuplicateKeyError(e)) {
        throw new HttpError(409, "Email already registered");
      }
      throw e;
    }
  }

  async deleteTeacher(id: string): Promise<void> {
    const deleted = await this.teacherCommand.deleteTeacher(id);

    if (!deleted) {
      throw new NotFoundError("Teacher not found", { id });
    }
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
