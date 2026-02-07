import { injectable } from "inversify";
import { RequestWithBody } from "../types/common.types.js";
import {
  StudentLoginType,
  StudentRegistrationType,
} from "../types/student/student.types.js";
import { inject } from "inversify";
import { TYPES } from "../composition/composition.types.js";
import { StudentService } from "../services/student/student.service.js";
import { NextFunction, Response } from "express";
import {
  TeacherLoginType,
  TeacherRegistrationType,
} from "../types/teacher/teacher.types.js";
import { TeacherService } from "../services/teacher/teacher.service.js";
import { AuthService } from "../services/auth/auth.service.js";
import { JwtService } from "../services/jwt/jwt.service.js";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.StudentService) protected studentService: StudentService,
    @inject(TYPES.TeacherService) protected teacherService: TeacherService,
    @inject(TYPES.AuthService) protected authService: AuthService,
    @inject(TYPES.JwtService) protected jwtService: JwtService,
  ) {}

  async registrationStudentController(
    req: RequestWithBody<StudentRegistrationType>,
    res: Response,
    next: NextFunction,
  ) {
    const { firstName, lastName, email, password, role } = req.body;
    try {
      await this.studentService.createStudent({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  async registrationTeacherController(
    req: RequestWithBody<TeacherRegistrationType>,
    res: Response,
    next: NextFunction,
  ) {
    const { firstName, lastName, email, password, role } = req.body;

    try {
      await this.teacherService.createTeacher({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }

  async loginStudentController(
    req: RequestWithBody<StudentLoginType>,
    res: Response,
    next: NextFunction,
  ) {
    const { email, password } = req.body;

    try {
      const user = await this.authService.checkAuthStudentCredentials(
        email,
        password,
      );

      const accessToken = await this.jwtService.createJWTAccessToken(user);
      const refreshToken = await this.jwtService.createJWTRefreshToken(user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res.status(200).send({ accessToken });
      return;
    } catch (error) {
      next(error);
    }
  }

  async loginTeacherController(
    req: RequestWithBody<TeacherLoginType>,
    res: Response,
    next: NextFunction,
  ) {
    const { email, password } = req.body;

    try {
      const teacher = await this.authService.checkAuthStudentCredentials(
        email,
        password,
      );

      const accessToken = await this.jwtService.createJWTAccessToken(teacher);
      const refreshToken = await this.jwtService.createJWTRefreshToken(teacher);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res.status(200).send({ accessToken });
      return;
    } catch (error) {
      next(error);
    }
  }
}
