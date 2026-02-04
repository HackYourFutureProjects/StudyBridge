import { check } from "express-validator";
import { StudentQuery } from "../../repositories/queryRepositories/studentQuery.js";
import { container } from "../../compositionRoot.js";
export const studentName = check("firstName")
  .trim()
  .notEmpty()
  .withMessage("First name is required")
  .isLength({ min: 2, max: 15 })
  .withMessage(
    "The first name must not be less then 2 symbols and more then 15 symbols",
  );

export const studentLastName = check("lastName")
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
    const studentQuery = container.get(StudentQuery);
    const user = await studentQuery.getStudentByEmail(value);

    if (user) {
      throw new Error("Email already exist");
    }

    return true;
  });

export const autStudentValidationMiddleware = () => [
  studentName,
  studentLastName,
  userPassword,
  email,
];
