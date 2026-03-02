import { TYPES } from "../composition/composition.types.js";
import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import { TeacherService } from "../services/teacher/teacher.service.js";
import { RequestWithParamsAndBody } from "../types/common.types.js";
import { TeacherStatus } from "../db/schemes/types/teacher.types.js";

@injectable()
export class ModeratorController {
  constructor(
    @inject(TYPES.ReviewService) private teacherService: TeacherService,
  ) {}

  async changeTeacherStatus(
    req: RequestWithParamsAndBody<{ id: string }, { status: TeacherStatus }>,
    res: Response,
    next: NextFunction,
  ) {
    const { status } = req.body;
    const { id } = req.params;
    try {
      await this.teacherService.changeTeacherStatus({ id, status });
      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  }
}
