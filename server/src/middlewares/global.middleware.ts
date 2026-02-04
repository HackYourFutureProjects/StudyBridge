import { NextFunction, Response } from "express";

import type { ErrorRequestHandler } from "express";
import { logError } from "../utils/logging.js";

export const globalErrorMiddleware: ErrorRequestHandler = (
  err,
  req,
  res: Response,
  next: NextFunction,
) => {
  logError(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({ message: "Internal server error" });
};
