import { NextFunction, Request, Response } from "express";
import { RateModel } from "../db/schemes/rateLimit.schema.js";

const ms = 10_000;
const maxRequests = 5;

export const accessCounterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const now = Date.now();
    const bucket = Math.floor(now / ms);
    const ip = req.ip;
    const url = req.originalUrl;

    const doc = await RateModel.findOneAndUpdate(
      { ip, url, bucket },
      {
        $inc: { count: 1 },
        $setOnInsert: { createdAt: new Date(now) },
      },
      { upsert: true, new: true, lean: true },
    );

    if (doc.count > maxRequests) {
      return res.sendStatus(429);
    }

    return next();
  } catch {
    return res.sendStatus(500);
  }
};
