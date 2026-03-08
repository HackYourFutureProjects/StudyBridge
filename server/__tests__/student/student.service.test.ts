import {
  createTestStudent,
  getFutureDate,
} from "../helpers/test.helpers.js";
import { StudentTypeDB } from "../../src/db/schemes/types/student.types.js";
import {
  setupTestDatabase,
  teardownTestDatabase,
  clearTestDatabase,
} from "../setup/database.setup.js";
import { StudentModel } from "../../src/db/schemes/studentSchema.js";
import { StudentQuery } from "../../src/repositories/queryRepositories/student.query.js";
import { StudentCommand } from "../../src/repositories/commandRepositories/student.command.js";
import { randomUUID } from "node:crypto";

describe("Student Service", () => {
  let studentQuery: StudentQuery;
  let studentCommand: StudentCommand;
  let testStudent: StudentTypeDB;

  beforeAll(async () => {
    await setupTestDatabase();
    studentQuery = new StudentQuery();
    studentCommand = new StudentCommand();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
    testStudent = await createTestStudent();
  });

  describe("StudentQuery", () => {
    it("should find student by id", async () => {
      const result = await studentQuery.getStudentById(testStudent.id);

      expect(result).toBeTruthy();
      expect(result?.id).toBe(testStudent.id);
      expect(result?.firstName).toBe(testStudent.firstName);
      expect(result?.lastName).toBe(testStudent.lastName);
      expect(result?.email).toBe(testStudent.email);
    });

    it("should return null for nonexistent student", async () => {
      const result = await studentQuery.getStudentById("nonexistent-student");
      expect(result).toBeNull();
    });

    it("should find student by email", async () => {
      const result = await studentQuery.getStudentByEmail(testStudent.email);

      expect(result).toBeTruthy();
      expect(result?.id).toBe(testStudent.id);
      expect(result?.email).toBe(testStudent.email);
    });

    it("should return null for nonexistent email", async () => {
      const result = await studentQuery.getStudentByEmail("nonexistent@test.com");
      expect(result).toBeNull();
    });

    it("should be case sensitive for email search", async () => {
      const upperCaseEmail = testStudent.email.toUpperCase();
      const result = await studentQuery.getStudentByEmail(upperCaseEmail);
      expect(result).toBeNull();
    });
  });

  describe("StudentCommand", () => {
    it("should create new student", async () => {
      const newStudentData = {
        id: randomUUID(),
        firstName: "NewStudent",
        lastName: "Test",
        email: `newstudent.${Date.now()}@test.com`,
        passwordHash: "hashedpassword123",
        passwordSalt: "salt123",
        profileImageUrl: null,
        phoneNumber: null,
        address: null,
        mainLanguage: null,
        role: "student" as const,
        authProvider: "local" as const,
        googleSub: null,
        createdAt: new Date(),
        passwordReset: {
          tokenHash: null,
          expiresAt: null,
        },
      };

      const result = await studentCommand.createStudent(newStudentData);

      expect(result).toBeTruthy();
      expect(result.firstName).toBe("NewStudent");
      expect(result.lastName).toBe("Test");
      expect(result.email).toBe(newStudentData.email);
      expect(result.role).toBe("student");
    });

    it("should update student profile", async () => {
      const updates = {
        firstName: "UpdatedName",
        lastName: "UpdatedLastName",
        phoneNumber: "+1234567890",
        address: "123 Test Street",
      };

      const result = await studentCommand.updateStudent(testStudent.id, updates);

      expect(result).toBeTruthy();
      expect(result?.firstName).toBe("UpdatedName");
      expect(result?.lastName).toBe("UpdatedLastName");
      expect(result?.phoneNumber).toBe("+1234567890");
      expect(result?.address).toBe("123 Test Street");
    });

    it("should update profile image", async () => {
      const profileImageUrl = "https://example.com/new-profile.jpg";

      const result = await studentCommand.updateStudent(testStudent.id, {
        profileImageUrl,
      });

      expect(result).toBeTruthy();
      expect(result?.profileImageUrl).toBe(profileImageUrl);
    });

    it("should handle partial updates", async () => {
      const originalStudent = await studentQuery.getStudentById(testStudent.id);

      const result = await studentCommand.updateStudent(testStudent.id, {
        firstName: "OnlyFirstName",
      });

      expect(result).toBeTruthy();
      expect(result?.firstName).toBe("OnlyFirstName");
      expect(result?.lastName).toBe(originalStudent?.lastName);
      expect(result?.email).toBe(originalStudent?.email);
    });

    it("should return null when updating nonexistent student", async () => {
      const result = await studentCommand.updateStudent("nonexistent-student", {
        firstName: "NonExistent",
      });

      expect(result).toBeNull();
    });

    it("should update password reset token", async () => {
      const tokenHash = "reset-token-hash";
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

      const result = await studentCommand.updateStudent(testStudent.id, {
        passwordReset: {
          tokenHash,
          expiresAt,
        },
      });

      expect(result).toBeTruthy();
      expect(result?.passwordReset.tokenHash).toBe(tokenHash);
      expect(result?.passwordReset.expiresAt).toEqual(expiresAt);
    });

    it("should clear password reset token", async () => {
      // First set a token
      await studentCommand.updateStudent(testStudent.id, {
        passwordReset: {
          tokenHash: "temp-token",
          expiresAt: new Date(),
        },
      });

      // Then clear it
      const result = await studentCommand.updateStudent(testStudent.id, {
        passwordReset: {
          tokenHash: null,
          expiresAt: null,
        },
      });

      expect(result).toBeTruthy();
      expect(result?.passwordReset.tokenHash).toBeNull();
      expect(result?.passwordReset.expiresAt).toBeNull();
    });
  });

  describe("StudentModel CRUD Operations", () => {
    it("should create student in database", async () => {
      const studentData = {
        id: randomUUID(),
        firstName: "Database",
        lastName: "Student",
        email: `database.student.${Date.now()}@test.com`,
        passwordHash: "hashedpassword123",
        passwordSalt: "salt123",
        profileImageUrl: null,
        phoneNumber: null,
        address: null,
        mainLanguage: null,
        role: "student" as const,
        authProvider: "local" as const,
        googleSub: null,
        createdAt: new Date(),
        passwordReset: {
          tokenHash: null,
          expiresAt: null,
        },
      };

      const created = await StudentModel.create(studentData);

      expect(created.firstName).toBe("Database");
      expect(created.lastName).toBe("Student");
      expect(created.email).toBe(studentData.email);
      expect(created.role).toBe("student");
    });

    it("should find student by email in database", async () => {
      const found = await StudentModel.findOne({ email: testStudent.email }).exec();

      expect(found).toBeTruthy();
      expect(found?.id).toBe(testStudent.id);
      expect(found?.email).toBe(testStudent.email);
    });

    it("should update student in database", async () => {
      const updated = await StudentModel.findOneAndUpdate(
        { id: testStudent.id },
        { firstName: "DatabaseUpdated", phoneNumber: "+9876543210" },
        { new: true }
      ).exec();

      expect(updated?.firstName).toBe("DatabaseUpdated");
      expect(updated?.phoneNumber).toBe("+9876543210");
    });

    it("should delete student from database", async () => {
      await StudentModel.findOneAndDelete({ id: testStudent.id }).exec();

      const deleted = await StudentModel.findOne({ id: testStudent.id }).exec();
      expect(deleted).toBeNull();
    });

    it("should handle unique email constraint", async () => {
      const duplicateStudentData = {
        id: randomUUID(),
        firstName: "Duplicate",
        lastName: "Student",
        email: testStudent.email, // Same email as existing student
        passwordHash: "hashedpassword123",
        passwordSalt: "salt123",
        profileImageUrl: null,
        phoneNumber: null,
        address: null,
        mainLanguage: null,
        role: "student" as const,
        authProvider: "local" as const,
        googleSub: null,
        createdAt: new Date(),
        passwordReset: {
          tokenHash: null,
          expiresAt: null,
        },
      };

      await expect(StudentModel.create(duplicateStudentData)).rejects.toThrow();
    });
  });

  describe("Student Profile Validation", () => {
    it("should preserve existing data when partially updating", async () => {
      const original = await studentQuery.getStudentById(testStudent.id);

      const result = await studentCommand.updateStudent(testStudent.id, {
        firstName: "PartialUpdate",
      });

      expect(result?.firstName).toBe("PartialUpdate");
      expect(result?.lastName).toBe(original?.lastName);
      expect(result?.email).toBe(original?.email);
      expect(result?.phoneNumber).toBe(original?.phoneNumber);
    });

    it("should handle null values correctly", async () => {
      const result = await studentCommand.updateStudent(testStudent.id, {
        phoneNumber: null,
        address: null,
        profileImageUrl: null,
      });

      expect(result?.phoneNumber).toBeNull();
      expect(result?.address).toBeNull();
      expect(result?.profileImageUrl).toBeNull();
    });
  });
});