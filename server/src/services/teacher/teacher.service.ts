import { inject, injectable } from "inversify";
import { TeacherCommand } from "../../repositories/commandRepositories/teacher.command.js";
import { TYPES } from "../../composition/composition.types.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import {
  TeacherStatus,
  TeacherTypeDB,
} from "../../db/schemes/types/teacher.types.js";
import { teacherMapper } from "../../utils/mappers/teacher.mapper.js";
import { HttpError, NotFoundError } from "../../utils/error.util.js";
import { StudentQuery } from "../../repositories/queryRepositories/student.query.js";
import { TeacherQuery } from "../../repositories/queryRepositories/teacher.query.js";
import { isMongoDuplicateKeyError } from "../../utils/duplicateType.guard.js";
import { RegistrationType } from "../../types/auth/auth.types.js";

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
  }: RegistrationType) {
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
      passwordReset: {
        tokenHash: null,
        expiresAt: null,
      },
      priceFrom: 0,
      rating: 0,
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
      timezone: "Europe/Amsterdam",
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
      authProvider: "local",
      googleSub: null,
      createdAt: new Date(),
      status: "draft",
      role,
      isPublic: false,
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

  async changeTeacherStatus({
    id,
    status,
  }: {
    id: string;
    status: TeacherStatus;
  }) {
    const isTeacherExist = await this.teacherQuery.getTeacherById(id);

    if (!isTeacherExist) {
      throw new NotFoundError("Teacher not found", { id });
    }

    return await this.teacherCommand.updateTeacherStatus(id, status);
  }

  async updateTeacherVisibility({
    teacherId,
    isPublic,
  }: {
    teacherId: string;
    isPublic: boolean;
  }): Promise<void> {
    const teacher = await this.teacherQuery.getTeacherById(teacherId);

    if (!teacher) {
      throw new NotFoundError("Teacher not found", { id: teacherId });
    }

    // Teacher cannot self-publish when moderated to blocked/rejected.
    if (
      isPublic &&
      (teacher.status === "blocked" || teacher.status === "rejected")
    ) {
      throw new HttpError(403, "You cannot publish this profile");
    }

    // explicit unpublish: always make profile private and hidden from public list.
    if (!isPublic) {
      // Preserve moderated statuses; only active should move back to draft.
      const nextStatus: TeacherStatus =
        teacher.status === "blocked" || teacher.status === "rejected"
          ? teacher.status
          : "draft";

      await this.teacherCommand.updateTeacherVisibility(teacherId, {
        isPublic: false,
        status: nextStatus,
      });
      return;
    }

    // publish is allowed only for complete profiles.
    const hasSubjects = teacher.subjects.length > 0;
    const hasSchedule = Object.values(teacher.availability).some(
      (slots) => slots.length > 0,
    );

    if (!hasSubjects || !hasSchedule) {
      throw new HttpError(
        400,
        "Add at least 1 subject and 1 schedule slot before publishing",
      );
    }

    // profile is complete and teacher requested publish.
    await this.teacherCommand.updateTeacherVisibility(teacherId, {
      isPublic: true,
      status: "pending",
    });
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
