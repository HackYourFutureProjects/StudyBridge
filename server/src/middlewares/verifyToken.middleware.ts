import { inject, injectable } from "inversify";
import { TYPES } from "../composition/composition.types.js";
import { JwtService } from "../services/jwt/jwt.service.js";
import { NextFunction, Request, Response } from "express";

@injectable()
export class VerifyMiddleware {
  constructor(@inject(TYPES.JwtService) private jwtService: JwtService) {}

  verify = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.sendStatus(401);
    }

    const payload = await this.jwtService.verifyToken(token);

    if (!payload?.userId || !payload?.role) {
      return res.sendStatus(401);
    }
    req.auth = { userId: payload.userId, role: payload.role };
    return next();
  };
}
