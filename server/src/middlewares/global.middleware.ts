import type { ErrorRequestHandler } from "express";
import { logError } from "../utils/logging.js";
import { HttpError } from "../utils/error.util.js";

export const globalErrorMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  logError(err);

  if (res.headersSent) return next(err);

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({ message: "Internal server error" });
};
