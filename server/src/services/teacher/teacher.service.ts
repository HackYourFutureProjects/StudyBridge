import { inject, injectable } from "inversify";
import { TeacherCommand } from "../../repositories/commandRepositories/teacher.command.js";
import { TYPES } from "../../composition/composition.types.js";
import { TeacherRegistrationType } from "../../types/teacher/teacher.types.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { TeacherTypeDB } from "../../db/schemes/types/teacher.types.js";
import { teacherMapper } from "../../utils/mappers/teacher.mapper.js";

@injectable()
export class TeacherService {
  constructor(
    @inject(TYPES.TeacherCommand) private teacherCommand: TeacherCommand,
  ) {}

  async createTeacher({
    firstName,
    email,
    lastName,
    password,
    role,
  }: TeacherRegistrationType) {
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
    const teacher = await this.teacherCommand.createTeacher(newTeacher);

    return teacherMapper(teacher);
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
