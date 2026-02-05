import { NextFunction, Request, Response } from "express";
export const requireSelf =
  (paramName = "id") =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.sendStatus(401);
    }

    if (req.params[paramName] !== req.auth.userId) {
      return res.sendStatus(403);
    }
    return next();
  };
