import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { createStreamToken } from "../services/stream/stream.client.js";

/**
 This file checks if the user is logged in.
If yes, it asks Stream service to make a video token and sends it back to the frontend.
If not logged in, it returns “unauthorized.”
 */
@injectable()
export class StreamController {
  async getToken(req: Request, res: Response, next: NextFunction) {
    try {
      // 'req.auth' comes from auth middleware; if missing, user is not logged in.
      const auth = req.auth;
      if (!auth) return res.sendStatus(401);

      const { userId, role } = auth;

      const streamData = createStreamToken({ userId, role });
      return res.status(200).json(streamData);
    } catch (error) {
      return next(error);
    }
  }
}
