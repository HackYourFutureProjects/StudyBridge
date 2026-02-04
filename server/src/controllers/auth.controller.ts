import { injectable } from "inversify";
import { RequestWithBody } from "../types/common.types.js";
import { StudentRegistrationType } from "../types/student/student.types.js";
import { inject } from "inversify";
import { TYPES } from "../composition/composition.types.js";
import { StudentService } from "../services/student/student.service.js";
import { NextFunction, Response } from "express";
@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.StudentService) protected studentService: StudentService,
  ) {}

  async registrationStudentController(
    req: RequestWithBody<StudentRegistrationType>,
    res: Response,
    next: NextFunction,
  ) {
    const { firstName, lastName, email, password, role } = req.body;
    try {
      await this.studentService.createStudent({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}
