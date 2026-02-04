import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req).formatWith((error) => {
    switch (error.type) {
      case "field": {
        return {
          message: error.msg,
          field: error.path,
        };
      }
      default:
        return {
          message: error.msg,
          field: "not found",
        };
    }
  });

  if (!errors.isEmpty()) {
    const err = errors.array({ onlyFirstError: true });

    return res.status(400).json({ errorsMessages: err });
  } else {
    return next();
  }
};
