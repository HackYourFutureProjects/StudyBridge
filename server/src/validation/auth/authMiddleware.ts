import { check } from "express-validator";
import { StudentQuery } from "../../repositories/queryRepositories/student.query.js";
import { container } from "../../composition/compositionRoot.js";
import { TYPES } from "../../composition/composition.types.js";
import { TeacherQuery } from "../../repositories/queryRepositories/teacher.query.js";
const allowedRoles = ["student", "teacher"] as const;
export const FirstName = check("firstName")
  .trim()
  .notEmpty()
  .withMessage("First name is required")
  .isLength({ min: 2, max: 15 })
  .withMessage(
    "The first name must not be less then 2 symbols and more then 15 symbols",
  );

export const Role = check("role")
  .trim()
  .notEmpty()
  .withMessage("Role is required")
  .isIn(allowedRoles)
  .withMessage("Role must be one of: student, teacher");

export const LastName = check("lastName")
  .trim()
  .notEmpty()
  .withMessage("Last name is required")
  .isLength({ min: 2, max: 15 })
  .withMessage(
    "Last name must not be less then 2 symbols and more then 15 symbols",
  );
export const Password = check("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 5 })
  .withMessage("Password must be at least 5 characters long");

export const Email = check("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Invalid email format")
  .isLength({ min: 3 })
  .withMessage("Email should be at least 3 characters long")
  .custom(async (value) => {
    const studentQuery = container.get<StudentQuery>(TYPES.StudentQuery);
    const teacherQuery = container.get<TeacherQuery>(TYPES.TeacherQuery);
    const student = await studentQuery.getStudentByEmail(value);
    const teacher = await teacherQuery.getTeacherByEmail(value);
    if (student || teacher) {
      throw new Error("Email already exist");
    }
    return true;
  });

export const EmailLogin = check("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Invalid email format");

export const PasswordLogin = check("password")
  .notEmpty()
  .withMessage("Password is required");

export const authLoginValidationMiddleware = () => [
  EmailLogin,
  PasswordLogin,
  Role,
];

export const authRegistrationValidationMiddleware = () => [
  FirstName,
  LastName,
  Password,
  Email,
  Role,
];
