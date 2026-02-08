import type { ErrorRequestHandler } from "express";
import { logError } from "../utils/logging.js";
import { HttpError } from "../utils/error.util.js";

export const globalErrorMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof HttpError) {
    if (err.statusCode >= 500) {
      logError(err);
    }

    return res.status(err.statusCode).json({ message: err.message });
  }

  logError(err);
  return res.status(500).json({ message: "Internal server error" });
};
