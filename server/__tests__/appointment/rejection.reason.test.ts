import { AppointmentService } from "../../src/services/appointment/appointment.service.js";
import { AppointmentModel } from "../../src/db/schemes/appointmentSchema.js";
import {
  createTestAppointment,
  createTestStudent,
  createTestTeacher,
} from "../helpers/test.helpers.js";
import {
  setupTestDatabase,
  teardownTestDatabase,
} from "../setup/database.setup.js";
import { container } from "../../src/composition/compositionRoot.js";
import { TYPES } from "../../src/composition/composition.types.js";

describe("Appointment Rejection Reason", () => {
  let appointmentService: AppointmentService;
  let studentId: string;
  let teacherId: string;

  beforeAll(async () => {
    await setupTestDatabase();
    appointmentService = container.get<AppointmentService>(
      TYPES.AppointmentService,
    );

    const student = await createTestStudent();
    const teacher = await createTestTeacher();
    studentId = student.id;
    teacherId = teacher.id;
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await AppointmentModel.deleteMany({});
  });

  describe("Rejection Reason Validation", () => {
    it("should require rejection reason when rejecting appointment", async () => {
      const appointment = await createTestAppointment(studentId, teacherId);

      await expect(
        appointmentService.updateAppointmentStatus(appointment.id, {
          status: "rejected",
        }),
      ).rejects.toThrow(
        "Rejection reason is required when rejecting an appointment",
      );
    });

    it("should reject reason with less than 100 characters", async () => {
      const appointment = await createTestAppointment(studentId, teacherId);
      const shortReason = "Too short";

      await expect(
        appointmentService.updateAppointmentStatus(appointment.id, {
          status: "rejected",
          rejectionReason: shortReason,
        }),
      ).rejects.toThrow(
        "Rejection reason must be between 100 and 500 characters",
      );
    });

    it("should reject reason with more than 500 characters", async () => {
      const appointment = await createTestAppointment(studentId, teacherId);
      const longReason = "A".repeat(501);

      await expect(
        appointmentService.updateAppointmentStatus(appointment.id, {
          status: "rejected",
          rejectionReason: longReason,
        }),
      ).rejects.toThrow(
        "Rejection reason must be between 100 and 500 characters",
      );
    });

    it("should accept valid rejection reason (100-500 characters)", async () => {
      const appointment = await createTestAppointment(studentId, teacherId);
      const validReason =
        "This is a valid rejection reason that meets the minimum character requirement of 100 characters. The student did not provide sufficient information about their learning goals and objectives for this lesson.";

      const result = await appointmentService.updateAppointmentStatus(
        appointment.id,
        {
          status: "rejected",
          rejectionReason: validReason,
        },
      );

      expect(result).toBeDefined();
      expect(result?.status).toBe("rejected");
      expect(result?.rejectionReason).toBe(validReason);
    });

    it("should not require rejection reason for approved status", async () => {
      const appointment = await createTestAppointment(studentId, teacherId);

      const result = await appointmentService.updateAppointmentStatus(
        appointment.id,
        {
          status: "approved",
        },
      );

      expect(result).toBeDefined();
      expect(result?.status).toBe("approved");
      expect(result?.rejectionReason).toBeNull();
    });

    it("should not require rejection reason for pending status", async () => {
      const appointment = await createTestAppointment(studentId, teacherId);

      const result = await appointmentService.updateAppointmentStatus(
        appointment.id,
        {
          status: "pending",
        },
      );

      expect(result).toBeDefined();
      expect(result?.status).toBe("pending");
      expect(result?.rejectionReason).toBeNull();
    });
  });

  describe("Rejection Reason Storage", () => {
    it("should store rejection reason in database", async () => {
      const appointment = await createTestAppointment(studentId, teacherId);
      const rejectionReason =
        "This appointment is rejected because the student did not provide adequate preparation materials and the requested time slot conflicts with another commitment.";

      await appointmentService.updateAppointmentStatus(appointment.id, {
        status: "rejected",
        rejectionReason,
      });

      const updatedAppointment = await AppointmentModel.findOne({
        id: appointment.id,
      });

      expect(updatedAppointment?.status).toBe("rejected");
      expect(updatedAppointment?.rejectionReason).toBe(rejectionReason);
    });

    it("should retrieve rejection reason when fetching appointment", async () => {
      const appointment = await createTestAppointment(studentId, teacherId);
      const rejectionReason =
        "The requested lesson topic requires more advanced preparation than the student's current level allows. Please complete prerequisite materials first.";

      await appointmentService.updateAppointmentStatus(appointment.id, {
        status: "rejected",
        rejectionReason,
      });

      const retrievedAppointment = await appointmentService.getAppointmentById(
        appointment.id,
      );

      expect(retrievedAppointment?.status).toBe("rejected");
      expect(retrievedAppointment?.rejectionReason).toBe(rejectionReason);
    });
  });

  describe("Edge Cases", () => {
    it("should handle exactly 100 characters", async () => {
      const appointment = await createTestAppointment(studentId, teacherId);
      const exactReason = "A".repeat(100);

      const result = await appointmentService.updateAppointmentStatus(
        appointment.id,
        {
          status: "rejected",
          rejectionReason: exactReason,
        },
      );

      expect(result?.status).toBe("rejected");
      expect(result?.rejectionReason).toBe(exactReason);
    });

    it("should handle exactly 500 characters", async () => {
      const appointment = await createTestAppointment(studentId, teacherId);
      const exactReason = "A".repeat(500);

      const result = await appointmentService.updateAppointmentStatus(
        appointment.id,
        {
          status: "rejected",
          rejectionReason: exactReason,
        },
      );

      expect(result?.status).toBe("rejected");
      expect(result?.rejectionReason).toBe(exactReason);
    });

    it("should handle 99 characters (should fail)", async () => {
      const appointment = await createTestAppointment(studentId, teacherId);
      const shortReason = "A".repeat(99);

      await expect(
        appointmentService.updateAppointmentStatus(appointment.id, {
          status: "rejected",
          rejectionReason: shortReason,
        }),
      ).rejects.toThrow(
        "Rejection reason must be between 100 and 500 characters",
      );
    });

    it("should handle 501 characters (should fail)", async () => {
      const appointment = await createTestAppointment(studentId, teacherId);
      const longReason = "A".repeat(501);

      await expect(
        appointmentService.updateAppointmentStatus(appointment.id, {
          status: "rejected",
          rejectionReason: longReason,
        }),
      ).rejects.toThrow(
        "Rejection reason must be between 100 and 500 characters",
      );
    });
  });
});
