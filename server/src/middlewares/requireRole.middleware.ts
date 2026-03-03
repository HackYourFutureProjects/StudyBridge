import { NextFunction, Request, Response } from "express";
import { Role } from "../types/common.types.js";

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.sendStatus(401);
    }
    if (!roles.includes(req.auth.role)) {
      return res.sendStatus(403);
    }
    return next();
  };
