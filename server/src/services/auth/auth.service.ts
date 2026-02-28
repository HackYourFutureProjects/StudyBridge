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
import { OAuth2Client } from "google-auth-library";
import {
  GoogleAuthRequest,
  PasswordResetTokenPayload,
  RefreshTokenPayload,
  RotateArgs,
} from "../../types/auth/auth.types.js";
import { StudentCommand } from "../../repositories/commandRepositories/student.command.js";
import { TeacherCommand } from "../../repositories/commandRepositories/teacher.command.js";
import { sendPasswordResetEmail } from "../email/mailSender.js";
import { logError, logWarning } from "../../utils/logging.js";

@injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(
    @inject(TYPES.StudentQuery) private studentQuery: StudentQuery,
    @inject(TYPES.TeacherQuery) private teacherQuery: TeacherQuery,
    @inject(TYPES.StudentCommand) private studentCommand: StudentCommand,
    @inject(TYPES.TeacherCommand) private teacherCommand: TeacherCommand,
    @inject(TYPES.JwtService) protected jwtService: JwtService,
    @inject(TYPES.RefreshSessionRepository)
    protected refreshSessionRepository: RefreshSessionRepository,
  ) {}
  async checkAuthStudentCredentials(email: string, password: string) {
    const student = await this.studentQuery.findUserByEmailWithHash(email);

    if (!student) {
      throw new HttpError(401, "Invalid credentials");
    }

    if (
      student.authProvider === "google" ||
      !student.passwordSalt ||
      !student.passwordHash
    ) {
      throw new HttpError(409, "This account uses Google login");
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

    if (
      teacher.authProvider === "google" ||
      !teacher.passwordSalt ||
      !teacher.passwordHash
    ) {
      throw new HttpError(409, "This account uses Google login");
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
    const session = await this.assertRefreshSessionValid(payload, refreshToken);
    const newAccessToken = this.jwtService.createJWTAccessToken({
      userId: payload.userId,
      role: payload.role,
    });

    const newRefreshToken = this.jwtService.createJWTRefreshToken({
      userId: payload.userId,
      role: payload.role,
      sessionId: session.id,
    });

    await this.refreshSessionRepository.updateById(session.id, {
      refreshTokenHash: this.sha256(newRefreshToken),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      revokedAt: null,
      replacedBySessionId: null,
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

  //reset password
  async requestPasswordResetForRole(
    email: string,
    role: "student" | "teacher",
  ) {
    const user =
      role === "student"
        ? await this.studentQuery.findUserByEmailWithHash(email)
        : await this.teacherQuery.findTeacherByEmailWithHash(email);

    if (!user) return;

    //Creates a signed reset token with identity + role
    const token = this.jwtService.createPasswordResetToken({
      userId: user.id,
      role,
      purpose: "password-reset",
    });
    const tokenHash = this.sha256(token);

    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); //expires in 3 hours

    const updated =
      role === "student"
        ? await this.studentCommand.updatePasswordResetToken(
            user.id,
            tokenHash,
            expiresAt,
          )
        : await this.teacherCommand.updatePasswordResetToken(
            user.id,
            tokenHash,
            expiresAt,
          );

    if (!updated) {
      logWarning(
        `Password reset token was not saved for role=${role}, userId=${user.id}`,
      );
      return; //if token was not saved, then stop
    }

    const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:5173";

    const resetUrl = new URL("/reset-password", appBaseUrl);
    resetUrl.searchParams.set("token", token);
    resetUrl.searchParams.set("role", role);
    const resetLink = resetUrl.toString();

    try {
      //send email with the reset link
      await sendPasswordResetEmail(email, resetLink);
    } catch (error) {
      logError(error);
      throw new HttpError(500, "Failed to send reset email");
    }
  }

  // reset password confirm

  async resetPasswordWithToken(token: string, newPassword: string) {
    let payload: PasswordResetTokenPayload;

    try {
      payload = this.jwtService.verifyPasswordResetToken(token);
    } catch {
      throw new HttpError(400, "Invalid or expired reset token");
    }

    if (payload.purpose !== "password-reset") {
      throw new HttpError(400, "Invalid or expired reset token");
    }

    const tokenHash = this.sha256(token);

    if (payload.role === "student") {
      const student =
        await this.studentQuery.findUserByResetTokenHash(tokenHash);
      if (!student || student.id !== payload.userId) {
        throw new HttpError(400, "Invalid or expired reset token");
      }

      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await this._generateHash(newPassword, passwordSalt);

      const updated =
        await this.studentCommand.updatePasswordAndClearResetToken(
          student.id,
          passwordHash,
          passwordSalt,
        );
      if (!updated) throw new HttpError(500, "Password was not updated");

      await this.refreshSessionRepository.revokeAllForUser(
        student.id,
        "student",
      );
      return;
    }

    if (payload.role === "teacher") {
      const teacher =
        await this.teacherQuery.findTeacherByResetTokenHash(tokenHash);
      if (!teacher || teacher.id !== payload.userId) {
        throw new HttpError(400, "Invalid or expired reset token");
      }

      const passwordSalt = await bcrypt.genSalt(10);
      const passwordHash = await this._generateHash(newPassword, passwordSalt);

      const updated =
        await this.teacherCommand.updatePasswordAndClearResetToken(
          teacher.id,
          passwordHash,
          passwordSalt,
        );
      if (!updated) throw new HttpError(500, "Password was not updated");

      await this.refreshSessionRepository.revokeAllForUser(
        teacher.id,
        "teacher",
      );
      return;
    }

    throw new HttpError(400, "Invalid or expired reset token");
  }

  async changePasswordForAuthenticatedUser(args: {
    userId: string;
    role: "student" | "teacher";
    oldPassword: string;
    newPassword: string;
  }) {
    const { userId, role, oldPassword, newPassword } = args;

    const user =
      role === "student"
        ? await this.studentQuery.findStudentByIdWithHash(userId)
        : await this.teacherQuery.findTeacherByIdWithHash(userId);

    if (!user) throw new HttpError(401, "Unauthorized");
    if (
      user.authProvider === "google" ||
      !user.passwordSalt ||
      !user.passwordHash
    ) {
      throw new HttpError(409, "Password is not set for Google account");
    }
    const oldHash = await this._generateHash(oldPassword, user.passwordSalt);
    if (oldHash !== user.passwordHash)
      throw new HttpError(401, "Old password is incorrect");

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(newPassword, passwordSalt);

    const updated =
      role === "student"
        ? await this.studentCommand.updatePassword(
            userId,
            passwordHash,
            passwordSalt,
          )
        : await this.teacherCommand.updatePassword(
            userId,
            passwordHash,
            passwordSalt,
          );

    if (!updated) throw new HttpError(500, "Password was not updated");

    //invalidate all refresh sessions for that user and role.
    await this.refreshSessionRepository.revokeAllForUser(userId, role);
  }

  async verifyGoogleIdToken(idToken: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new HttpError(401, "Invalid Google token");
    }

    if (!payload.email_verified) {
      throw new HttpError(401, "Email not verified");
    }

    return {
      email: payload.email,
      googleSub: payload.sub,
      firstName: payload.given_name ?? "",
      lastName: payload.family_name ?? "",
      picture: payload.picture ?? null,
    };
  }

  async googleRegister(args: GoogleAuthRequest) {
    const { idToken, role } = args;
    const goggle = await this.verifyGoogleIdToken(idToken);

    const existingStudent = await this.studentQuery.getStudentByEmail(
      goggle.email,
    );
    const existingTeacher = await this.teacherQuery.getTeacherByEmail(
      goggle.email,
    );

    if (existingStudent || existingTeacher) {
      const existingRole = existingStudent ? "student" : "teacher";
      throw new HttpError(
        409,
        existingRole === role
          ? "Account already exists. Please use Google login."
          : `This email is already registered as ${existingRole}.`,
      );
    }

    if (role === "student") {
      return await this.studentCommand.createStudent({
        id: randomUUID(),
        role,
        email: goggle.email,
        firstName: goggle.firstName,
        lastName: goggle.lastName,
        profileImageUrl: goggle.picture ?? null,
        address: null,
        mainLanguage: null,
        authProvider: "google",
        googleSub: goggle.googleSub,
        passwordReset: { tokenHash: null, expiresAt: null },
        createdAt: new Date(),
      });
    } else {
      return await this.teacherCommand.createTeacher({
        id: randomUUID(),
        role,
        email: goggle.email,
        firstName: goggle.firstName,
        lastName: goggle.lastName,
        profileImageUrl: goggle.picture ?? null,
        address: null,
        mainLanguage: null,
        authProvider: "google",
        googleSub: goggle.googleSub,
        passwordReset: { tokenHash: null, expiresAt: null },
        createdAt: new Date(),
      });
    }
  }

  async googleLogin(args: GoogleAuthRequest) {
    const { idToken, role } = args;
    const google = await this.verifyGoogleIdToken(idToken);

    if (role === "student") {
      const student = await this.studentQuery.getStudentByEmail(google.email);
      if (!student)
        throw new HttpError(404, "Account not found. Please sign up.");

      if (student.authProvider !== "google" || !student.googleSub) {
        throw new HttpError(
          409,
          "This account uses password login. Please sign in with email/password.",
        );
      }

      if (student.googleSub !== google.googleSub) {
        throw new HttpError(401, "Google account mismatch");
      }

      return student;
    }

    // teacher
    const teacher = await this.teacherQuery.getTeacherByEmail(google.email);
    if (!teacher)
      throw new HttpError(404, "Account not found. Please sign up.");

    if (teacher.authProvider !== "google" || !teacher.googleSub) {
      throw new HttpError(
        409,
        "This account uses password login. Please sign in with email/password.",
      );
    }

    if (teacher.googleSub !== google.googleSub) {
      throw new HttpError(401, "Google account mismatch");
    }

    return teacher;
  }
}
