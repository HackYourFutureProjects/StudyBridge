import { inject, injectable } from "inversify";
import { StudentQuery } from "../../repositories/queryRepositories/student.query.js";
import { TYPES } from "../../composition/composition.types.js";
import { HttpError, UnauthorizedError } from "../../utils/error.util.js";
import { studentMapper } from "../../utils/mappers/student.mapper.js";
import bcrypt from "bcryptjs";
import { TeacherQuery } from "../../repositories/queryRepositories/teacher.query.js";
import { teacherMapper } from "../../utils/mappers/teacher.mapper.js";
import { createHash, randomUUID } from "node:crypto";
import { JwtService } from "../jwt/jwt.service.js";
import { RefreshSessionRepository } from "../../repositories/commandRepositories/refreshSession.repository.js";
import {
  RefreshTokenPayload,
  RotateArgs,
} from "../../types/auth/auth.types.js";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.StudentQuery) private studentQuery: StudentQuery,
    @inject(TYPES.TeacherQuery) private teacherQuery: TeacherQuery,
    @inject(TYPES.JwtService) protected jwtService: JwtService,
    @inject(TYPES.RefreshSessionRepository)
    protected refreshSessionRepository: RefreshSessionRepository,
  ) {}

  async checkAuthStudentCredentials(email: string, password: string) {
    const student = await this.studentQuery.findUserByEmailWithHash(email);

    if (!student) {
      throw new HttpError(401, "Invalid credentials");
    }

    const passwordHash = await this._generateHash(
      password,
      student.passwordSalt,
    );

    if (student.passwordHash === passwordHash) {
      return studentMapper(student);
    } else {
      throw new HttpError(401, "Invalid credentials");
    }
  }

  async checkAuthTeacherCredentials(email: string, password: string) {
    const teacher = await this.teacherQuery.findTeacherByEmailWithHash(email);

    if (!teacher) {
      throw new HttpError(401, "Invalid credentials");
    }

    const passwordHash = await this._generateHash(
      password,
      teacher.passwordSalt,
    );

    if (teacher.passwordHash === passwordHash) {
      return teacherMapper(teacher);
    } else {
      throw new HttpError(401, "Invalid credentials");
    }
  }

  async createRefreshSession({
    userId,
    role,
  }: {
    userId: string;
    role: "teacher" | "student";
  }) {
    await this.refreshSessionRepository.revokeAllForUser(userId, role);
    const sessionId = randomUUID();
    const refreshToken = this.jwtService.createJWTRefreshToken({
      userId,
      role,
      sessionId,
    });

    await this.refreshSessionRepository.create({
      id: sessionId,
      userId,
      role,
      refreshTokenHash: this.sha256(refreshToken),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      createdAt: new Date(),
      revokedAt: null,
      replacedBySessionId: null,
    });

    return { refreshToken, sessionId };
  }

  private async assertRefreshSessionValid(
    payload: RefreshTokenPayload,
    refreshToken: string,
  ) {
    const session = await this.refreshSessionRepository.findById(
      payload.sessionId,
    );
    if (!session) {
      throw new UnauthorizedError("Unauthorized");
    }

    if (session.revokedAt) {
      await this.refreshSessionRepository.revokeAllForUser(
        payload.userId,
        payload.role,
      );
      throw new UnauthorizedError("Unauthorized");
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedError("Unauthorized");
    }

    const tokenHash = this.sha256(refreshToken);
    if (tokenHash !== session.refreshTokenHash) {
      await this.refreshSessionRepository.revokeAllForUser(
        payload.userId,
        payload.role,
      );
      throw new UnauthorizedError("Unauthorized");
    }
    return session;
  }

  async rotateRefreshToken({ refreshToken, payload }: RotateArgs) {
    await this.assertRefreshSessionValid(payload, refreshToken);

    const newAccessToken = this.jwtService.createJWTAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    const { refreshToken: newRefreshToken } = await this.createRefreshSession({
      userId: payload.userId,
      role: payload.role,
    });

    return { newAccessToken, newRefreshToken };
  }

  async logoutByRefreshToken(refreshToken: string) {
    let payload: RefreshTokenPayload | null = null;

    try {
      payload = this.jwtService.verifyRefreshToken(refreshToken);
    } catch {
      return;
    }

    await this.refreshSessionRepository.revoke(payload.sessionId);
  }

  sha256(string: string) {
    return createHash("sha256").update(string).digest("hex");
  }
  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
