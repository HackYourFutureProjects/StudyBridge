import { body, param } from "express-validator";

export const createAppointmentValidationMiddleware = () => [
  body("studentId").exists().withMessage("Student ID is needed"),
  body("teacherId").exists().withMessage("Teacher ID is needed"),
  body("lesson").exists().withMessage("Lesson is needed"),
  body("price").exists().withMessage("Price is needed"),
  body("date").exists().withMessage("Date is needed"),
  body("time").exists().withMessage("Time is needed"),
];

export const updateAppointmentStatusValidationMiddleware = () => [
  body("status")
    .exists()
    .withMessage("Status is needed")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be either approved or rejected"),
];

export const idParamValidationMiddleware = () => [
  param("id")
    .exists()
    .withMessage("ID is needed")
    .isString()
    .withMessage("ID must be a string"),
];

export const studentIdParamValidationMiddleware = () => [
  param("studentId")
    .exists()
    .withMessage("Student ID is needed")
    .isString()
    .withMessage("Student ID must be a string"),
];

export const teacherIdParamValidationMiddleware = () => [
  param("teacherId")
    .exists()
    .withMessage("Teacher ID is needed")
    .isString()
    .withMessage("Teacher ID must be a string"),
];
