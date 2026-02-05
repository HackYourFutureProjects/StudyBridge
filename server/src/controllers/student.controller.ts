import { inject, injectable } from "inversify";
import { ParamsType, RequestWithParams } from "../types/common.types.js";
import { NextFunction, Response } from "express";
import { TYPES } from "../composition/composition.types.js";
import { StudentService } from "../services/student/student.service.js";

@injectable()
export class StudentController {
  constructor(
    @inject(TYPES.StudentService) private studentService: StudentService,
  ) {}

  async deleteStudent(
    req: RequestWithParams<ParamsType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await this.studentService.deleteStudent(req.params.id);
      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  }
}
