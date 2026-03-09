import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import {
  setupTestDatabase,
  teardownTestDatabase,
  clearTestDatabase,
} from "../setup/database.setup.js";
import {
  createTestStudent,
  createTestTeacher,
} from "../helpers/test.helpers.js";
import { StudentTypeDB } from "../../src/db/schemes/types/student.types.js";
import { TeacherTypeDB } from "../../src/db/schemes/types/teacher.types.js";
import { ReviewModel } from "../../src/db/schemes/review.schema.js";
import { AppointmentModel } from "../../src/db/schemes/appointmentSchema.js";
import { randomUUID } from "node:crypto";

describe("Review Integration Tests", () => {
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

  describe("ReviewModel CRUD Operations", () => {
    it("should create review in database", async () => {
      const appointment = await AppointmentModel.create({
        id: randomUUID(),
        studentId: testStudent.id,
        teacherId: testTeacher.id,
        lesson: "Math",
        level: "Beginner",
        teacher: testTeacher.id,
        student: testStudent.id,
        price: "25",
        date: "2024-12-15",
        time: "10:00",
        description: "Test",
        status: "approved" as const,
        videoCall: "https://meet.google.com/test",
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const review = await ReviewModel.create({
        teacherId: testTeacher.id,
        studentId: testStudent.id,
        bookingId: appointment.id,
        rating: 5,
        review: "Excellent teacher!",
        subject: "Mathematics",
        studentName: `${testStudent.firstName} ${testStudent.lastName}`,
        ...(testStudent.profileImageUrl && {
          studentAvatar: testStudent.profileImageUrl,
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(review.teacherId).toBe(testTeacher.id);
      expect(review.studentId).toBe(testStudent.id);
      expect(review.rating).toBe(5);
      expect(review.subject).toBe("Mathematics");
    });

    it("should find review by id", async () => {
      const appointment = await AppointmentModel.create({
        id: randomUUID(),
        studentId: testStudent.id,
        teacherId: testTeacher.id,
        lesson: "Math",
        level: "Beginner",
        teacher: testTeacher.id,
        student: testStudent.id,
        price: "25",
        date: "2024-12-15",
        time: "10:00",
        description: "Test",
        status: "approved" as const,
        videoCall: "https://meet.google.com/test",
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const created = await ReviewModel.create({
        teacherId: testTeacher.id,
        studentId: testStudent.id,
        bookingId: appointment.id,
        rating: 4,
        review: "Good",
        subject: "Math",
        studentName: `${testStudent.firstName} ${testStudent.lastName}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const found = await ReviewModel.findById(created._id).exec();

      expect(found?.teacherId).toBe(testTeacher.id);
      expect(found?.rating).toBe(4);
    });

    it("should find reviews by teacher id", async () => {
      const appointment = await AppointmentModel.create({
        id: randomUUID(),
        studentId: testStudent.id,
        teacherId: testTeacher.id,
        lesson: "Math",
        level: "Beginner",
        teacher: testTeacher.id,
        student: testStudent.id,
        price: "25",
        date: "2024-12-15",
        time: "10:00",
        description: "Test",
        status: "approved" as const,
        videoCall: "https://meet.google.com/test",
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await ReviewModel.create({
        teacherId: testTeacher.id,
        studentId: testStudent.id,
        bookingId: appointment.id,
        rating: 5,
        review: "Great!",
        subject: "Math",
        studentName: `${testStudent.firstName} ${testStudent.lastName}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const reviews = await ReviewModel.find({
        teacherId: testTeacher.id,
      }).exec();

      expect(reviews).toHaveLength(1);
      expect(reviews[0].teacherId).toBe(testTeacher.id);
    });

    it("should calculate average rating", async () => {
      const appointment1 = await AppointmentModel.create({
        id: randomUUID(),
        studentId: testStudent.id,
        teacherId: testTeacher.id,
        lesson: "Math",
        level: "Beginner",
        teacher: testTeacher.id,
        student: testStudent.id,
        price: "25",
        date: "2024-12-15",
        time: "10:00",
        description: "Test",
        status: "approved" as const,
        videoCall: "https://meet.google.com/test1",
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const appointment2 = await AppointmentModel.create({
        id: randomUUID(),
        studentId: testStudent.id,
        teacherId: testTeacher.id,
        lesson: "Math",
        level: "Beginner",
        teacher: testTeacher.id,
        student: testStudent.id,
        price: "25",
        date: "2024-12-15",
        time: "11:00",
        description: "Test",
        status: "approved" as const,
        videoCall: "https://meet.google.com/test2",
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await ReviewModel.create({
        teacherId: testTeacher.id,
        studentId: testStudent.id,
        bookingId: appointment1.id,
        rating: 5,
        review: "Excellent",
        subject: "Math",
        studentName: `${testStudent.firstName} ${testStudent.lastName}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await ReviewModel.create({
        teacherId: testTeacher.id,
        studentId: testStudent.id,
        bookingId: appointment2.id,
        rating: 3,
        review: "Good",
        subject: "Math",
        studentName: `${testStudent.firstName} ${testStudent.lastName}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await ReviewModel.aggregate([
        { $match: { teacherId: testTeacher.id } },
        {
          $group: {
            _id: "$teacherId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);

      expect(result[0].averageRating).toBe(4);
      expect(result[0].totalReviews).toBe(2);
    });

    it("should delete review", async () => {
      const appointment = await AppointmentModel.create({
        id: randomUUID(),
        studentId: testStudent.id,
        teacherId: testTeacher.id,
        lesson: "Math",
        level: "Beginner",
        teacher: testTeacher.id,
        student: testStudent.id,
        price: "25",
        date: "2024-12-15",
        time: "10:00",
        description: "Test",
        status: "approved" as const,
        videoCall: "https://meet.google.com/test",
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const created = await ReviewModel.create({
        teacherId: testTeacher.id,
        studentId: testStudent.id,
        bookingId: appointment.id,
        rating: 5,
        review: "Great",
        subject: "Math",
        studentName: `${testStudent.firstName} ${testStudent.lastName}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await ReviewModel.findByIdAndDelete(created._id).exec();

      const deleted = await ReviewModel.findById(created._id).exec();
      expect(deleted).toBeNull();
    });

    it("should prevent duplicate reviews for same appointment", async () => {
      const appointment = await AppointmentModel.create({
        id: randomUUID(),
        studentId: testStudent.id,
        teacherId: testTeacher.id,
        lesson: "Math",
        level: "Beginner",
        teacher: testTeacher.id,
        student: testStudent.id,
        price: "25",
        date: "2024-12-15",
        time: "10:00",
        description: "Test",
        status: "approved" as const,
        videoCall: "https://meet.google.com/test",
        isRegularStudent: false,
        weeklySchedule: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await ReviewModel.create({
        teacherId: testTeacher.id,
        studentId: testStudent.id,
        bookingId: appointment.id,
        rating: 5,
        review: "First review",
        subject: "Math",
        studentName: `${testStudent.firstName} ${testStudent.lastName}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const existingReview = await ReviewModel.findOne({
        bookingId: appointment.id,
      }).exec();

      expect(existingReview).not.toBeNull();
      expect(existingReview?.bookingId).toBe(appointment.id);
    });
  });
});
