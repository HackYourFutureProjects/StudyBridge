import { TYPES } from "../composition/composition.types.js";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TeacherService } from "../services/teacher/teacher.service.js";
import { RequestWithParamsAndBody } from "../types/common.types.js";
import { TeacherStatus } from "../db/schemes/types/teacher.types.js";
import { AuthService } from "../services/auth/auth.service.js";
import { JwtService } from "../services/jwt/jwt.service.js";

@injectable()
export class ModeratorController {
  constructor(
    @inject(TYPES.ReviewService) private teacherService: TeacherService,
    @inject(TYPES.AuthService) protected authService: AuthService,
    @inject(TYPES.JwtService) protected jwtService: JwtService,
  ) {}

  async changeTeacherStatus(
    req: RequestWithParamsAndBody<{ id: string }, { status: TeacherStatus }>,
    res: Response,
    next: NextFunction,
  ) {
    const { status } = req.body;
    const { id } = req.params;
    try {
      await this.teacherService.changeTeacherStatus({ id, status });
      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  }

  async loginModeratorController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { email, password } = req.body;

    try {
      const user = await this.authService.checkAuthModeratorCredentials(
        email,
        password,
      );

      const accessToken = this.jwtService.createJWTAccessToken({
        userId: user.id,
        role: user.role,
      });

      const { refreshToken } = await this.authService.createRefreshSession({
        userId: user.id,
        role: user.role,
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
}
