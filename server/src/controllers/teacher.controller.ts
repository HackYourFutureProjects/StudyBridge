import { inject, injectable } from "inversify";
import { ParamsType, RequestWithParams } from "../types/common.types.js";
import { NextFunction, Response } from "express";
import { TYPES } from "../composition/composition.types.js";
import { TeacherService } from "../services/teacher/teacher.service.js";

@injectable()
export class TeacherController {
  constructor(
    @inject(TYPES.TeacherService) private teacherService: TeacherService,
  ) {}

  async deleteTeacher(
    req: RequestWithParams<ParamsType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await this.teacherService.deleteTeacher(req.params.id);
      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  }
}
