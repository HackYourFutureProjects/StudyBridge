import { TeacherQuery } from "../../src/repositories/queryRepositories/teacher.query.js";
import { createTestTeacher } from "../helpers/test.helpers.js";
import { AvailabilityView } from "../../src/types/teacher/teacher.types.js";
import { TeacherTypeDB } from "../../src/db/schemes/types/teacher.types.js";
import {
  setupTestDatabase,
  teardownTestDatabase,
  clearTestDatabase,
} from "../setup/database.setup.js";

describe("Teacher Availability", () => {
  let teacherQuery: TeacherQuery;
  let testTeacher: TeacherTypeDB;

  beforeAll(async () => {
    await setupTestDatabase();
    teacherQuery = new TeacherQuery();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
    testTeacher = await createTestTeacher();
  });

  describe("replaceAvailabilityForWeek", () => {
    it("should update teacher availability successfully", async () => {
      const newAvailability: AvailabilityView = {
        monday: [
          { start: "09:00", end: "10:00" },
          { start: "14:00", end: "15:00" },
        ],
        tuesday: [{ start: "10:00", end: "11:00" }],
        wednesday: [],
        thursday: [{ start: "16:00", end: "17:00" }],
        friday: [{ start: "09:00", end: "12:00" }],
        saturday: [],
        sunday: [],
      };

      const result = await teacherQuery.replaceAvailabilityForWeek(
        testTeacher.id,
        newAvailability,
      );

      expect(result).toBeTruthy();
      expect(result?.monday).toHaveLength(2);
      expect(result?.monday[0].start).toBe("09:00");
      expect(result?.monday[0].end).toBe("10:00");
      expect(result?.tuesday).toHaveLength(1);
      expect(result?.wednesday).toHaveLength(0);
    });

    it("should return null for nonexistent teacher", async () => {
      const newAvailability: AvailabilityView = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      };

      const result = await teacherQuery.replaceAvailabilityForWeek(
        "nonexistent-teacher",
        newAvailability,
      );

      expect(result).toBeNull();
    });

    it("should handle empty availability", async () => {
      const emptyAvailability: AvailabilityView = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      };

      const result = await teacherQuery.replaceAvailabilityForWeek(
        testTeacher.id,
        emptyAvailability,
      );

      expect(result).toBeTruthy();
      expect(result?.monday).toHaveLength(0);
      expect(result?.tuesday).toHaveLength(0);
      expect(result?.wednesday).toHaveLength(0);
      expect(result?.thursday).toHaveLength(0);
      expect(result?.friday).toHaveLength(0);
      expect(result?.saturday).toHaveLength(0);
      expect(result?.sunday).toHaveLength(0);
    });
  });

  describe("findTeacherWeeklyAvailability", () => {
    it("should return teacher availability", async () => {
      const result = await teacherQuery.findTeacherWeeklyAvailability(
        testTeacher.id,
      );

      expect(result).toBeTruthy();
      expect(result).toHaveProperty("monday");
      expect(result).toHaveProperty("tuesday");
      expect(result).toHaveProperty("wednesday");
      expect(result).toHaveProperty("thursday");
      expect(result).toHaveProperty("friday");
      expect(result).toHaveProperty("saturday");
      expect(result).toHaveProperty("sunday");
    });

    it("should return null for nonexistent teacher", async () => {
      const result = await teacherQuery.findTeacherWeeklyAvailability(
        "nonexistent-teacher",
      );
      expect(result).toBeNull();
    });

    it("should return updated availability after modification", async () => {
      const newAvailability: AvailabilityView = {
        monday: [
          { start: "08:00", end: "09:00" },
          { start: "15:00", end: "16:00" },
        ],
        tuesday: [{ start: "10:00", end: "12:00" }],
        wednesday: [],
        thursday: [],
        friday: [{ start: "14:00", end: "18:00" }],
        saturday: [],
        sunday: [],
      };

      await teacherQuery.replaceAvailabilityForWeek(
        testTeacher.id,
        newAvailability,
      );

      const result = await teacherQuery.findTeacherWeeklyAvailability(
        testTeacher.id,
      );

      expect(result?.monday).toHaveLength(2);
      expect(result?.monday[0].start).toBe("08:00");
      expect(result?.tuesday).toHaveLength(1);
      expect(result?.tuesday[0].start).toBe("10:00");
      expect(result?.friday).toHaveLength(1);
      expect(result?.friday[0].end).toBe("18:00");
    });
  });

  describe("availability validation", () => {
    it("should handle overlapping time slots", async () => {
      const overlappingAvailability: AvailabilityView = {
        monday: [
          { start: "09:00", end: "11:00" },
          { start: "10:00", end: "12:00" },
        ],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      };

      const result = await teacherQuery.replaceAvailabilityForWeek(
        testTeacher.id,
        overlappingAvailability,
      );

      expect(result).toBeTruthy();
      expect(result?.monday).toHaveLength(2);
    });

    it("should handle multiple time slots per day", async () => {
      const multipleSlots: AvailabilityView = {
        monday: [
          { start: "08:00", end: "09:00" },
          { start: "10:00", end: "11:00" },
          { start: "14:00", end: "15:00" },
          { start: "16:00", end: "17:00" },
        ],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      };

      const result = await teacherQuery.replaceAvailabilityForWeek(
        testTeacher.id,
        multipleSlots,
      );

      expect(result).toBeTruthy();
      expect(result?.monday).toHaveLength(4);
      expect(result?.monday[0].start).toBe("08:00");
      expect(result?.monday[3].end).toBe("17:00");
    });
  });
});
