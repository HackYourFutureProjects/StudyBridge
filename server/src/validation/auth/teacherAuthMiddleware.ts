import { check } from "express-validator";
import { TeacherQuery } from "../../repositories/queryRepositories/teacher.query.js";
import { container } from "../../composition/compositionRoot.js";
import { TYPES } from "../../composition/composition.types.js";
const allowedRoles = ["student", "teacher", "admin"] as const;

export const teacherName = check("firstName")
  .trim()
  .notEmpty()
  .withMessage("First name is required")
  .isLength({ min: 2, max: 15 })
  .withMessage(
    "The first name must not be less then 2 symbols and more then 15 symbols",
  );

export const role = check("role")
  .trim()
  .notEmpty()
  .withMessage("Role is required")
  .isIn(allowedRoles)
  .withMessage("Role must be one of: student, teacher, admin");

export const teacherLastName = check("lastName")
  .trim()
  .notEmpty()
  .withMessage("Last name is required")
  .isLength({ min: 2, max: 15 })
  .withMessage(
    "Last name must not be less then 2 symbols and more then 15 symbols",
  );
export const userPassword = check("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 5 })
  .withMessage("Password must be at least 5 characters long");

export const email = check("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Invalid email format")
  .isLength({ min: 3 })
  .withMessage("Email should be at least 3 characters long")
  .custom(async (value) => {
    const teacherQuery = container.get<TeacherQuery>(TYPES.TeacherQuery);
    const user = await teacherQuery.getTeacherByEmail(value);

    if (user) {
      throw new Error("Email already exist");
    }
    return true;
  });

export const autTeacherValidationMiddleware = () => [
  teacherName,
  teacherLastName,
  userPassword,
  email,
  role,
];
