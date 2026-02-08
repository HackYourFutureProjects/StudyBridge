import { TYPES } from "../composition/composition.types.js";
import { inject, injectable } from "inversify";
import { JwtService } from "../services/jwt/jwt.service.js";
import { NextFunction, Request, Response } from "express";
@injectable()
export class RefreshTokenMiddleware {
  constructor(@inject(TYPES.JwtService) private jwtService: JwtService) {}

  handle = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.sendStatus(401);
    }

    const payload = this.jwtService.verifyRefreshToken(token);
    if (!payload) {
      return res.sendStatus(401);
    }

    req.refresh = { token, payload };
    return next();
  };
}
