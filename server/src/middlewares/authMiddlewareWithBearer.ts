import { NextFunction, Request, Response } from "express";
import { TYPES } from "../composition/composition.types.js";
import { JwtService } from "../services/jwt/jwt.service.js";
import { inject, injectable } from "inversify";

@injectable()
export class AuthMiddleware {
  constructor(@inject(TYPES.JwtService) private jwtService: JwtService) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      res.sendStatus(401);
      return;
    }
    if (req.headers.authorization.split(" ")[0] !== "Bearer") {
      res.sendStatus(401);
      return;
    }
    const token = req.headers.authorization.split(" ")[1];

    const payload = this.jwtService.verifyAccessToken(token);

    if (!payload?.userId || !payload?.role) {
      res.sendStatus(401);
      return;
    }
    req.auth = { userId: payload.userId, role: payload.role };
    return next();
  };
}
