import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { VideoCallService } from "../../src/services/video/videoCall.service.js";
import { VideoCallCommand } from "../../src/repositories/commandRepositories/videoCall.command.js";
import { VideoCallQuery } from "../../src/repositories/queryRepositories/videoCall.query.js";
import { HttpError } from "../../src/utils/error.util.js";
import { StartVideoCallInput } from "../../src/types/video/video.types.js";

const mockVideoCallCommand = {
  startVideoCall: jest.fn<() => Promise<unknown>>(),
  acceptCallById: jest.fn<() => Promise<unknown>>(),
  declineCallById: jest.fn<() => Promise<unknown>>(),
  endCallById: jest.fn<() => Promise<unknown>>(),
  markExpiredCallAsMissed: jest.fn<() => Promise<unknown>>(),
};

const mockVideoCallQuery = {
  getVideoByStreamCallId: jest.fn<() => Promise<unknown>>(),
  getIncomingCallForStudent: jest.fn<() => Promise<unknown>>(),
  getVideoById: jest.fn<() => Promise<unknown>>(),
};

jest.mock("../../src/db/schemes/studentSchema.js", () => ({
  StudentModel: {},
}));
jest.mock("../../src/db/schemes/teacherSchema.js", () => ({
  TeacherModel: {},
}));
jest.mock("../../src/db/schemes/videoCallSchema.js", () => ({
  VideoCallModel: {},
}));
jest.mock("../../src/socket/io.holder.js", () => ({ getIO: () => null }));

describe("VideoCallService", () => {
  let service: VideoCallService;

  beforeEach(() => {
    service = new VideoCallService(
      mockVideoCallCommand as unknown as VideoCallCommand,
      mockVideoCallQuery as unknown as VideoCallQuery,
    );
    jest.clearAllMocks();
  });

  describe("startCall", () => {
    it("should throw error if not teacher", async () => {
      const input: StartVideoCallInput = {
        authRole: "student",
        authUserId: "s1",
        teacherId: "t1",
        studentId: "s1",
        streamCallId: "stream1",
        expiresAt: new Date(),
      };
      await expect(service.startCall(input)).rejects.toThrow(
        new HttpError(403, "Only teachers can start calls"),
      );
    });

    it("should throw error if call already exists", async () => {
      const input: StartVideoCallInput = {
        authRole: "teacher",
        authUserId: "t1",
        teacherId: "t1",
        studentId: "s1",
        streamCallId: "stream1",
        expiresAt: new Date(),
      };
      mockVideoCallQuery.getVideoByStreamCallId.mockResolvedValue({
        id: "existing",
      });
      await expect(service.startCall(input)).rejects.toThrow(
        new HttpError(409, "This call already exists"),
      );
    });
  });

  describe("incomingCall", () => {
    it("should return incoming call for student", async () => {
      const mockCall = {
        id: "call1",
        expiresAt: new Date(Date.now() + 60000),
      };
      mockVideoCallQuery.getIncomingCallForStudent.mockResolvedValue(mockCall);

      const result = await service.incomingCall({
        authUserId: "s1",
        authRole: "student",
      });
      expect(result).toEqual(mockCall);
    });

    it("should throw error if not student", async () => {
      await expect(
        service.incomingCall({ authUserId: "t1", authRole: "teacher" }),
      ).rejects.toThrow(
        new HttpError(403, "This endpoint is for students only"),
      );
    });
  });

  describe("acceptCall", () => {
    it("should throw error if not student", async () => {
      await expect(
        service.acceptCall({
          callId: "call1",
          authUserId: "t1",
          authRole: "teacher",
        }),
      ).rejects.toThrow(
        new HttpError(403, "Students only can accept the call"),
      );
    });

    it("should throw error if call not found", async () => {
      mockVideoCallQuery.getVideoById.mockResolvedValue(null);
      await expect(
        service.acceptCall({
          callId: "call1",
          authUserId: "s1",
          authRole: "student",
        }),
      ).rejects.toThrow(new HttpError(404, "Call not found"));
    });
  });

  describe("declineCall", () => {
    it("should throw error if not student", async () => {
      await expect(
        service.declineCall({
          callId: "call1",
          authUserId: "t1",
          authRole: "teacher",
        }),
      ).rejects.toThrow(
        new HttpError(403, "Students only can decline the call"),
      );
    });
  });

  describe("endCall", () => {
    it("should throw error if call not found", async () => {
      mockVideoCallQuery.getVideoById.mockResolvedValue(null);
      await expect(
        service.endCall({ callId: "call1", authUserId: "t1" }),
      ).rejects.toThrow(new HttpError(404, "Call not found"));
    });

    it("should throw error if user not participant", async () => {
      const mockCall = { id: "call1", teacherId: "t1", studentId: "s1" };
      mockVideoCallQuery.getVideoById.mockResolvedValue(mockCall);

      await expect(
        service.endCall({ callId: "call1", authUserId: "other" }),
      ).rejects.toThrow(
        new HttpError(403, "Only participants can end the call"),
      );
    });
  });
});
