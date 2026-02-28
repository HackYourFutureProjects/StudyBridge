import { injectable } from "inversify";
import { RequestWithBody } from "../types/common.types.js";
import { StudentViewType } from "../types/student/student.types.js";
import { inject } from "inversify";
import { TYPES } from "../composition/composition.types.js";
import { StudentService } from "../services/student/student.service.js";
import { Request, NextFunction, Response } from "express";
import { TeacherViewType } from "../types/teacher/teacher.types.js";
import { TeacherService } from "../services/teacher/teacher.service.js";
import { AuthService } from "../services/auth/auth.service.js";
import { JwtService } from "../services/jwt/jwt.service.js";
import { StudentQuery } from "../repositories/queryRepositories/student.query.js";
import { TeacherQuery } from "../repositories/queryRepositories/teacher.query.js";
import {
  GoogleAuthRequest,
  LoginType,
  RegistrationType,
} from "../types/auth/auth.types.js";
import { Role } from "../../index.js";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.StudentService) protected studentService: StudentService,
    @inject(TYPES.TeacherService) protected teacherService: TeacherService,
    @inject(TYPES.AuthService) protected authService: AuthService,
    @inject(TYPES.JwtService) protected jwtService: JwtService,
    @inject(TYPES.StudentQuery) protected studentQuery: StudentQuery,
    @inject(TYPES.TeacherQuery) protected teacherQuery: TeacherQuery,
  ) {}

  async registrationUserController(
    req: RequestWithBody<RegistrationType>,
    res: Response,
    next: NextFunction,
  ) {
    const { firstName, lastName, email, password, role } = req.body;
    try {
      if (role === "student") {
        await this.studentService.createStudent({
          firstName,
          lastName,
          email,
          password,
          role,
        });
      } else {
        await this.teacherService.createTeacher({
          firstName,
          lastName,
          email,
          password,
          role,
        });
      }

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  async loginController(
    req: RequestWithBody<LoginType>,
    res: Response,
    next: NextFunction,
  ) {
    const { email, password, role } = req.body;
    try {
      const credentialCheck: Record<
        Role,
        (e: string, p: string) => Promise<StudentViewType | TeacherViewType>
      > = {
        student: this.authService.checkAuthStudentCredentials.bind(
          this.authService,
        ),
        teacher: this.authService.checkAuthTeacherCredentials.bind(
          this.authService,
        ),
      };
      const user = await credentialCheck[role](email, password);

      const accessToken = this.jwtService.createJWTAccessToken({
        userId: user.id,
        role: role,
      });

      const { refreshToken } = await this.authService.createRefreshSession({
        userId: user.id,
        role: role,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 2 * 60 * 60 * 1000,
        sameSite: "lax",
      });
      res.status(200).send({ accessToken });
      return;
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req.auth!;

      const me =
        role === "student"
          ? await this.studentQuery.getStudentById(userId)
          : await this.teacherQuery.getTeacherById(userId);

      if (!me) {
        return res.sendStatus(401);
      }

      return res.status(200).send(me);
    } catch (e) {
      return next(e);
    }
  }

  async refreshController(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, payload } = req.refresh!;
      const { newAccessToken, newRefreshToken } =
        await this.authService.rotateRefreshToken({
          refreshToken: token,
          payload,
        });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 2 * 60 * 60 * 1000,
      });

      return res.status(200).send({ accessToken: newAccessToken });
    } catch (e) {
      return next(e);
    }
  }

  async requestPasswordResetStudentController(
    req: RequestWithBody<{ email: string }>,
    res: Response,
    next: NextFunction,
  ) {
    const { email } = req.body;

    try {
      await this.authService.requestPasswordResetForRole(email, "student");
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }

  async requestPasswordResetTeacherController(
    req: RequestWithBody<{ email: string }>,
    res: Response,
    next: NextFunction,
  ) {
    const { email } = req.body;

    try {
      await this.authService.requestPasswordResetForRole(email, "teacher");
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }

  async resetPasswordController(
    req: RequestWithBody<{
      token: string;
      newPassword: string;
      confirmPassword: string;
    }>,
    res: Response,
    next: NextFunction,
  ) {
    const { token, newPassword } = req.body;

    try {
      await this.authService.resetPasswordWithToken(token, newPassword);
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }

  //the Logout  Controller

  async logoutController(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken; // To get the refresh token from the cookie

      if (refreshToken) {
        await this.authService.logoutByRefreshToken(refreshToken); // To delete the session in the database by deleting the refresh token
      }

      // Clear the refresh token cookie from the client side
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }

  async updatePasswordController(
    req: RequestWithBody<{
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const auth = req.auth;
      if (!auth) return res.sendStatus(401);

      await this.authService.changePasswordForAuthenticatedUser({
        userId: auth.userId,
        role: auth.role,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
      });

      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }

  async googleRegisterController(
    req: RequestWithBody<GoogleAuthRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { idToken, role } = req.body;

      const user = await this.authService.googleRegister({ idToken, role });

      const accessToken = this.jwtService.createJWTAccessToken({
        userId: user.id,
        role,
      });

      const { refreshToken } = await this.authService.createRefreshSession({
        userId: user.id,
        role,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 2 * 60 * 60 * 1000,
        sameSite: "lax",
      });

      return res.status(200).send({ accessToken });
    } catch (e) {
      return next(e);
    }
  }

  async googleLoginController(
    req: RequestWithBody<GoogleAuthRequest>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { idToken, role } = req.body;

      const user = await this.authService.googleLogin({ idToken, role });

      const accessToken = this.jwtService.createJWTAccessToken({
        userId: user.id,
        role,
      });

      const { refreshToken } = await this.authService.createRefreshSession({
        userId: user.id,
        role,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 2 * 60 * 60 * 1000,
        sameSite: "lax",
      });

      return res.status(200).send({ accessToken });
    } catch (e) {
      return next(e);
    }
  }
}
