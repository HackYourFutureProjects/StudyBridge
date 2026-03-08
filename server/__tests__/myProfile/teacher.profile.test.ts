import { TeacherQuery } from "../../src/repositories/queryRepositories/teacher.query.js";
import { createTestTeacher } from "../helpers/test.helpers.js";
import { UpdateTeacherProfileInput } from "../../src/types/teacher/teacher.types.js";
import { TeacherTypeDB } from "../../src/db/schemes/types/teacher.types.js";
import {
  setupTestDatabase,
  teardownTestDatabase,
  clearTestDatabase,
} from "../setup/database.setup.js";

describe("Teacher Profile", () => {
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

  describe("updateMyProfile", () => {
    it("should update basic profile information", async () => {
      const updates: UpdateTeacherProfileInput = {
        firstName: "UpdatedJane",
        lastName: "UpdatedSmith",
        phoneNumber: "+1234567890",
        bio: "Updated bio for experienced teacher",
      };

      const result = await teacherQuery.updateMyProfile(
        testTeacher.id,
        updates,
      );

      expect(result).toBeTruthy();
      expect(result?.firstName).toBe("UpdatedJane");
      expect(result?.lastName).toBe("UpdatedSmith");
      expect(result?.phoneNumber).toBe("+1234567890");
      expect(result?.bio).toBe("Updated bio for experienced teacher");
    });

    it("should update experience and profile image", async () => {
      const updates: UpdateTeacherProfileInput = {
        experience: 5,
        profileImageUrl: "https://example.com/new-profile.jpg",
      };

      const result = await teacherQuery.updateMyProfile(
        testTeacher.id,
        updates,
      );

      expect(result).toBeTruthy();
      expect(result?.experience).toBe(5);
      expect(result?.profileImageUrl).toBe(
        "https://example.com/new-profile.jpg",
      );
    });

    it("should update subjects and calculate priceFrom", async () => {
      const updates: UpdateTeacherProfileInput = {
        subjects: [
          {
            subjectName: "Advanced Mathematics",
            description: "Advanced math tutoring",
            levels: [{ level: "Advanced", price: 50 }],
            experienceYears: 8,
            hourlyRate: 50,
          },
          {
            subjectName: "Physics",
            description: "Physics tutoring",
            levels: [{ level: "Intermediate", price: 45 }],
            experienceYears: 6,
            hourlyRate: 45,
          },
          {
            subjectName: "Chemistry",
            description: "Chemistry tutoring",
            levels: [{ level: "Beginner", price: 40 }],
            experienceYears: 4,
            hourlyRate: 40,
          },
        ],
      };

      const result = await teacherQuery.updateMyProfile(
        testTeacher.id,
        updates,
      );

      expect(result).toBeTruthy();
      expect(result?.subjects).toHaveLength(3);
      expect(result?.subjects[0].subjectName).toBe("Advanced Mathematics");
      expect(result?.subjects[0].hourlyRate).toBe(50);
      expect(result?.priceFrom).toBe(40);
    });

    it("should handle partial updates", async () => {
      const originalTeacher = await teacherQuery.getTeacherById(testTeacher.id);

      const updates: UpdateTeacherProfileInput = {
        firstName: "PartialUpdate",
      };

      const result = await teacherQuery.updateMyProfile(
        testTeacher.id,
        updates,
      );

      expect(result).toBeTruthy();
      expect(result?.firstName).toBe("PartialUpdate");
      expect(result?.lastName).toBe(originalTeacher?.lastName);
      expect(result?.email).toBe(originalTeacher?.email);
    });

    it("should return null for nonexistent teacher", async () => {
      const updates: UpdateTeacherProfileInput = {
        firstName: "NonExistent",
      };

      const result = await teacherQuery.updateMyProfile(
        "nonexistent-teacher",
        updates,
      );
      expect(result).toBeNull();
    });

    it("should handle empty subjects array", async () => {
      const updates: UpdateTeacherProfileInput = {
        subjects: [],
      };

      const result = await teacherQuery.updateMyProfile(
        testTeacher.id,
        updates,
      );

      expect(result).toBeTruthy();
      expect(result?.subjects).toHaveLength(0);
    });

    it("should update multiple fields simultaneously", async () => {
      const updates: UpdateTeacherProfileInput = {
        firstName: "MultiUpdate",
        lastName: "Teacher",
        phoneNumber: "+9876543210",
        experience: 10,
        bio: "Comprehensive profile update",
        profileImageUrl: "https://example.com/multi-update.jpg",
        subjects: [
          {
            subjectName: "Mathematics",
            description: "Expert math tutoring",
            levels: [{ level: "Expert", price: 60 }],
            experienceYears: 10,
            hourlyRate: 60,
          },
        ],
      };

      const result = await teacherQuery.updateMyProfile(
        testTeacher.id,
        updates,
      );

      expect(result).toBeTruthy();
      expect(result?.firstName).toBe("MultiUpdate");
      expect(result?.lastName).toBe("Teacher");
      expect(result?.phoneNumber).toBe("+9876543210");
      expect(result?.experience).toBe(10);
      expect(result?.bio).toBe("Comprehensive profile update");
      expect(result?.profileImageUrl).toBe(
        "https://example.com/multi-update.jpg",
      );
      expect(result?.subjects).toHaveLength(1);
      expect(result?.subjects[0].hourlyRate).toBe(60);
      expect(result?.priceFrom).toBe(60);
    });
  });

  describe("getTeacherById", () => {
    it("should return teacher profile", async () => {
      const result = await teacherQuery.getTeacherById(testTeacher.id);

      expect(result).toBeTruthy();
      expect(result?.id).toBe(testTeacher.id);
      expect(result?.firstName).toBe(testTeacher.firstName);
      expect(result?.lastName).toBe(testTeacher.lastName);
      expect(result?.email).toBe(testTeacher.email);
    });

    it("should return null for nonexistent teacher", async () => {
      const result = await teacherQuery.getTeacherById("nonexistent-teacher");
      expect(result).toBeNull();
    });

    it("should return updated profile after modification", async () => {
      const updates: UpdateTeacherProfileInput = {
        firstName: "Updated",
        bio: "Updated bio",
      };

      await teacherQuery.updateMyProfile(testTeacher.id, updates);
      const result = await teacherQuery.getTeacherById(testTeacher.id);

      expect(result?.firstName).toBe("Updated");
      expect(result?.bio).toBe("Updated bio");
    });
  });

  describe("getTeacherByEmail", () => {
    it("should return teacher by email", async () => {
      const result = await teacherQuery.getTeacherByEmail(testTeacher.email);

      expect(result).toBeTruthy();
      expect(result?.id).toBe(testTeacher.id);
      expect(result?.email).toBe(testTeacher.email);
    });

    it("should return null for nonexistent email", async () => {
      const result = await teacherQuery.getTeacherByEmail(
        "nonexistent@test.com",
      );
      expect(result).toBeNull();
    });

    it("should be case sensitive for email", async () => {
      const upperCaseEmail = testTeacher.email.toUpperCase();
      const result = await teacherQuery.getTeacherByEmail(upperCaseEmail);
      expect(result).toBeNull();
    });
  });

  describe("profile validation", () => {
    it("should preserve existing data when not updated", async () => {
      const originalTeacher = await teacherQuery.getTeacherById(testTeacher.id);

      const updates: UpdateTeacherProfileInput = {
        firstName: "OnlyFirstName",
      };

      const result = await teacherQuery.updateMyProfile(
        testTeacher.id,
        updates,
      );

      expect(result?.firstName).toBe("OnlyFirstName");
      expect(result?.lastName).toBe(originalTeacher?.lastName);
      expect(result?.email).toBe(originalTeacher?.email);
      expect(result?.subjects).toEqual(originalTeacher?.subjects);
    });
  });
});
