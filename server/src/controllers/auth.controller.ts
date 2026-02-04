import { injectable } from "inversify";
import { RequestWithBody } from "../types/common.types.js";
import { StudentRegistrationType } from "../types/student/student.types.js";
import { inject } from "inversify";
import { TYPES } from "../composition/composition.types.js";
import { StudentService } from "../services/student/student.service.js";
import { Response } from "express";
@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.StudentService) protected studentService: StudentService,
  ) {}

  async registrationStudentController(
    req: RequestWithBody<StudentRegistrationType>,
    res: Response,
  ) {
    const { firstName, lastName, email, password } = req.body;

    await this.studentService.createStudent({
      firstName,
      lastName,
      email,
      password,
    });

    res.sendStatus(204);
    return;
  }
}
