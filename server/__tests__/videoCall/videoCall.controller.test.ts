import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { VideoCallController } from "../../src/controllers/videoCall.controller.js";
import { NextFunction, Response } from "express";

type MockResponse = {
  status: jest.Mock;
  json: jest.Mock;
  sendStatus: jest.Mock;
};

type MockRequest = {
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  auth?: {
    userId?: string;
    role?: string;
  };
};

const mockVideoCallService = {
  startCall: jest.fn<() => Promise<unknown>>(),
  incomingCall: jest.fn<() => Promise<unknown>>(),
  acceptCall: jest.fn<() => Promise<unknown>>(),
  declineCall: jest.fn<() => Promise<unknown>>(),
  endCall: jest.fn<() => Promise<unknown>>(),
};

describe("VideoCallController", () => {
  let controller: VideoCallController;
  let mockResponse: MockResponse;
  let mockNext: NextFunction;

  beforeEach(() => {
    controller = new VideoCallController(
      mockVideoCallService as unknown as VideoCallController["videoCallService"],
    );
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("startVideoCallController", () => {
    it("should start video call successfully", async () => {
      const req: MockRequest = {
        body: {
          teacherId: "t1",
          studentId: "s1",
          streamCallId: "stream1",
          expiresAt: new Date(),
        },
        auth: { userId: "t1", role: "teacher" },
      };

      const mockCall = { id: "call1", status: "ringing" };
      mockVideoCallService.startCall.mockResolvedValue(mockCall);

      await controller.startVideoCallController(
        req as never,
        mockResponse as unknown as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCall);
    });

    it("should return 401 if no auth", async () => {
      const req: MockRequest = { body: {}, auth: undefined };
      await controller.startVideoCallController(
        req as never,
        mockResponse as unknown as Response,
        mockNext,
      );
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
    });

    it("should return 403 for invalid role", async () => {
      const req: MockRequest = {
        body: {},
        auth: { userId: "u1", role: "admin" },
      };
      await controller.startVideoCallController(
        req as never,
        mockResponse as unknown as Response,
        mockNext,
      );
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(403);
    });
  });

  describe("incomingCallController", () => {
    it("should get incoming call for student", async () => {
      const req: MockRequest = { auth: { userId: "s1", role: "student" } };
      const mockCall = { id: "call1", status: "ringing" };
      mockVideoCallService.incomingCall.mockResolvedValue(mockCall);

      await controller.incomingCallController(
        req as never,
        mockResponse as unknown as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCall);
    });

    it("should return 403 for invalid role", async () => {
      const req: MockRequest = { auth: { userId: "u1", role: "admin" } };
      await controller.incomingCallController(
        req as never,
        mockResponse as unknown as Response,
        mockNext,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });

  describe("acceptCallController", () => {
    it("should accept call successfully", async () => {
      const req: MockRequest = {
        params: { callId: "call1" },
        auth: { userId: "s1", role: "student" },
      };
      const mockCall = { id: "call1", status: "accepted" };
      mockVideoCallService.acceptCall.mockResolvedValue(mockCall);

      await controller.acceptCallController(
        req as never,
        mockResponse as unknown as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCall);
    });

    it("should return 404 if call not found", async () => {
      const req: MockRequest = {
        params: { callId: "call1" },
        auth: { userId: "s1", role: "student" },
      };
      mockVideoCallService.acceptCall.mockResolvedValue(null);

      await controller.acceptCallController(
        req as never,
        mockResponse as unknown as Response,
        mockNext,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe("declineCallController", () => {
    it("should decline call successfully", async () => {
      const req: MockRequest = {
        params: { callId: "call1" },
        auth: { userId: "s1", role: "student" },
      };
      const mockCall = { id: "call1", status: "declined" };
      mockVideoCallService.declineCall.mockResolvedValue(mockCall);

      await controller.declineCallController(
        req as never,
        mockResponse as unknown as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCall);
    });
  });

  describe("endCallController", () => {
    it("should end call successfully", async () => {
      const req: MockRequest = {
        params: { callId: "call1" },
        auth: { userId: "t1", role: "teacher" },
      };
      const mockCall = { id: "call1", status: "ended" };
      mockVideoCallService.endCall.mockResolvedValue(mockCall);

      await controller.endCallController(
        req as never,
        mockResponse as unknown as Response,
        mockNext,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCall);
    });

    it("should handle service errors", async () => {
      const req: MockRequest = {
        params: { callId: "call1" },
        auth: { userId: "t1" },
      };
      const error = new Error("Service error");
      mockVideoCallService.endCall.mockRejectedValue(error);

      await controller.endCallController(
        req as never,
        mockResponse as unknown as Response,
        mockNext,
      );
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
