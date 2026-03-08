import {
  createTestStudent,
  createTestTeacher,
  getFutureDate,
  getPastDate,
} from "../helpers/test.helpers.js";
import { CreateAppointmentType } from "../../src/types/appointment/appointment.types.js";
import { StudentTypeDB } from "../../src/db/schemes/types/student.types.js";
import { TeacherTypeDB } from "../../src/db/schemes/types/teacher.types.js";
import {
  setupTestDatabase,
  teardownTestDatabase,
  clearTestDatabase,
} from "../setup/database.setup.js";
import { AppointmentBusinessValidation } from "../../src/validation/appointment/appointmentBusinessValidation.js";
import { AppointmentModel } from "../../src/db/schemes/appointmentSchema.js";
import { randomUUID } from "node:crypto";

describe("Appointment Business Logic", () => {
  let testStudent: StudentTypeDB;
  let testTeacher: TeacherTypeDB;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
    testStudent = await createTestStudent();
    testTeacher = await createTestTeacher();
  });

  const createValidAppointment = (): CreateAppointmentType => ({
    studentId: testStudent.id,
    teacherId: testTeacher.id,
    lesson: "Mathematics",
    level: "Beginner",
    price: "25",
    date: getFutureDate(),
    time: "10:00",
    description: "Math lesson",
  });

  describe("AppointmentBusinessValidation", () => {
    it("should validate and create appointment with valid data", async () => {
      const appointmentData = createValidAppointment();

      // This should not throw
      await expect(
        AppointmentBusinessValidation.validateCreateAppointment(
          appointmentData,
        ),
      ).resolves.not.toThrow();
    });

    it("should prevent duplicate appointments", async () => {
      const appointmentData = createValidAppointment();

      // Create first appointment
      const appointment = {
        id: randomUUID(),
        studentId: appointmentData.studentId,
        teacherId: appointmentData.teacherId,
        lesson: appointmentData.lesson,
        level: appointmentData.level || "",
        teacher: appointmentData.teacherId,
        student: appointmentData.studentId,
        price: appointmentData.price,
        date: appointmentData.date,
        time: appointmentData.time,
        description: appointmentData.description || "",
        status: "pending" as const,
        videoCall: `https://meet.google.com/${appointmentData.teacherId}-${appointmentData.studentId}-${Date.now()}`,
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await AppointmentModel.create(appointment);

      await expect(
        AppointmentBusinessValidation.validateCreateAppointment(
          appointmentData,
        ),
      ).rejects.toThrow(
        "You already have an appointment scheduled for this date and time",
      );
    });

    it("should reject past dates", async () => {
      const appointmentData = {
        ...createValidAppointment(),
        date: getPastDate(),
      };

      await expect(
        AppointmentBusinessValidation.validateCreateAppointment(
          appointmentData,
        ),
      ).rejects.toThrow("Cannot create appointments in the past");
    });

    it("should reject nonexistent student", async () => {
      const appointmentData = {
        ...createValidAppointment(),
        studentId: "nonexistent-student",
      };

      await expect(
        AppointmentBusinessValidation.validateCreateAppointment(
          appointmentData,
        ),
      ).rejects.toThrow("Student not found");
    });

    it("should reject nonexistent teacher", async () => {
      const appointmentData = {
        ...createValidAppointment(),
        teacherId: "nonexistent-teacher",
      };

      await expect(
        AppointmentBusinessValidation.validateCreateAppointment(
          appointmentData,
        ),
      ).rejects.toThrow("Teacher not found");
    });

    it("should prevent self booking", async () => {
      const teacherAsStudent = await createTestStudent({
        id: testTeacher.id,
        email: `teacher.student.${Date.now()}@test.com`,
      });

      const appointmentData = {
        ...createValidAppointment(),
        studentId: teacherAsStudent.id,
      };

      await expect(
        AppointmentBusinessValidation.validateCreateAppointment(
          appointmentData,
        ),
      ).rejects.toThrow("Teachers cannot book appointments with themselves");
    });
  });

  describe("AppointmentModel CRUD Operations", () => {
    it("should create appointment in database", async () => {
      const appointmentData = createValidAppointment();

      const appointment = {
        id: randomUUID(),
        studentId: appointmentData.studentId,
        teacherId: appointmentData.teacherId,
        lesson: appointmentData.lesson,
        level: appointmentData.level || "",
        teacher: appointmentData.teacherId,
        student: appointmentData.studentId,
        price: appointmentData.price,
        date: appointmentData.date,
        time: appointmentData.time,
        description: appointmentData.description || "",
        status: "pending" as const,
        videoCall: `https://meet.google.com/${appointmentData.teacherId}-${appointmentData.studentId}-${Date.now()}`,
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const created = await AppointmentModel.create(appointment);

      expect(created.studentId).toBe(testStudent.id);
      expect(created.teacherId).toBe(testTeacher.id);
      expect(created.status).toBe("pending");
      expect(created.lesson).toBe("Mathematics");
      expect(created.price).toBe("25");
    });

    it("should find appointment by id", async () => {
      const appointmentData = createValidAppointment();

      const appointment = {
        id: randomUUID(),
        studentId: appointmentData.studentId,
        teacherId: appointmentData.teacherId,
        lesson: appointmentData.lesson,
        level: appointmentData.level || "",
        teacher: appointmentData.teacherId,
        student: appointmentData.studentId,
        price: appointmentData.price,
        date: appointmentData.date,
        time: appointmentData.time,
        description: appointmentData.description || "",
        status: "pending" as const,
        videoCall: `https://meet.google.com/${appointmentData.teacherId}-${appointmentData.studentId}-${Date.now()}`,
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const created = await AppointmentModel.create(appointment);
      const found = await AppointmentModel.findOne({ id: created.id }).exec();

      expect(found?.id).toBe(created.id);
      expect(found?.studentId).toBe(testStudent.id);
      expect(found?.teacherId).toBe(testTeacher.id);
    });

    it("should update appointment status", async () => {
      const appointmentData = createValidAppointment();

      const appointment = {
        id: randomUUID(),
        studentId: appointmentData.studentId,
        teacherId: appointmentData.teacherId,
        lesson: appointmentData.lesson,
        level: appointmentData.level || "",
        teacher: appointmentData.teacherId,
        student: appointmentData.studentId,
        price: appointmentData.price,
        date: appointmentData.date,
        time: appointmentData.time,
        description: appointmentData.description || "",
        status: "pending" as const,
        videoCall: `https://meet.google.com/${appointmentData.teacherId}-${appointmentData.studentId}-${Date.now()}`,
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const created = await AppointmentModel.create(appointment);

      const updated = await AppointmentModel.findOneAndUpdate(
        { id: created.id },
        { status: "approved", updatedAt: new Date() },
        { new: true },
      ).exec();

      expect(updated?.status).toBe("approved");
    });

    it("should delete appointment", async () => {
      const appointmentData = createValidAppointment();

      const appointment = {
        id: randomUUID(),
        studentId: appointmentData.studentId,
        teacherId: appointmentData.teacherId,
        lesson: appointmentData.lesson,
        level: appointmentData.level || "",
        teacher: appointmentData.teacherId,
        student: appointmentData.studentId,
        price: appointmentData.price,
        date: appointmentData.date,
        time: appointmentData.time,
        description: appointmentData.description || "",
        status: "pending" as const,
        videoCall: `https://meet.google.com/${appointmentData.teacherId}-${appointmentData.studentId}-${Date.now()}`,
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const created = await AppointmentModel.create(appointment);
      await AppointmentModel.findOneAndDelete({ id: created.id }).exec();

      const deleted = await AppointmentModel.findOne({ id: created.id }).exec();
      expect(deleted).toBeNull();
    });

    it("should set regular student", async () => {
      const appointmentData = createValidAppointment();

      const appointment = {
        id: randomUUID(),
        studentId: appointmentData.studentId,
        teacherId: appointmentData.teacherId,
        lesson: appointmentData.lesson,
        level: appointmentData.level || "",
        teacher: appointmentData.teacherId,
        student: appointmentData.studentId,
        price: appointmentData.price,
        date: appointmentData.date,
        time: appointmentData.time,
        description: appointmentData.description || "",
        status: "pending" as const,
        videoCall: `https://meet.google.com/${appointmentData.teacherId}-${appointmentData.studentId}-${Date.now()}`,
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const created = await AppointmentModel.create(appointment);

      const updated = await AppointmentModel.findOneAndUpdate(
        { id: created.id },
        {
          isRegularStudent: true,
          addedToRegularAt: new Date(),
        },
        { new: true },
      ).exec();

      expect(updated?.isRegularStudent).toBe(true);
      expect(updated?.addedToRegularAt).toBeTruthy();
    });
  });
});
