import { inject, injectable } from "inversify";
import { RequestWithBody, RequestWithParams } from "../types/common.types.js";
import { VideoCallService } from "../services/video/videoCall.service.js";
import { NextFunction, Request, Response } from "express";
import { TYPES } from "../composition/composition.types.js";
import { CreateVideoCallType } from "../types/video/video.types.js";

@injectable()
export class VideoCallController {
  constructor(
    @inject(TYPES.VideoCallService) private videoCallService: VideoCallService,
  ) {}

  async startVideoCallController(
    req: RequestWithBody<CreateVideoCallType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const auth = req.auth;
      if (!auth) return res.sendStatus(401);

      const videoCall = await this.videoCallService.startCall({
        ...req.body,
        authUserId: auth.userId,
        authRole: auth.role,
      });

      return res.status(201).json(videoCall);
    } catch (error) {
      return next(error);
    }
  }

  async incomingCallController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.auth?.userId;
      const role = req.auth?.role;

      if (!userId || !role) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const incoming = await this.videoCallService.incomingCall({
        authUserId: userId,
        authRole: role,
      });

      return res.status(200).json(incoming);
    } catch (error) {
      return next(error);
    }
  }

  async acceptCallController(
    req: RequestWithParams<{ callId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const callId = req.params.callId;
      const userId = req.auth?.userId;
      const role = req.auth?.role;

      if (!userId || !role) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const acceptedCall = await this.videoCallService.acceptCall({
        callId,
        authUserId: userId,
        authRole: role,
      });

      if (!acceptedCall) {
        return res.status(404).json({ message: "Call not found" });
      }

      return res.status(200).json(acceptedCall);
    } catch (error) {
      return next(error);
    }
  }

  async declineCallController(
    req: RequestWithParams<{ callId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const callId = req.params.callId;
      const userId = req.auth?.userId;
      const role = req.auth?.role;

      if (!userId || !role) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const declinedCall = await this.videoCallService.declineCall({
        callId,
        authUserId: userId,
        authRole: role,
      });

      if (!declinedCall) {
        return res.status(404).json({ message: "Call not found" });
      }

      return res.status(200).json(declinedCall);
    } catch (error) {
      return next(error);
    }
  }
} // end class
