import { inject, injectable } from "inversify";
import {
  ParamsType,
  RequestWithParams,
  ResponseWithData,
} from "../types/common.types.js";
import { NextFunction } from "express";
import { TYPES } from "../composition/composition.types.js";
import { TeacherService } from "../services/teacher/teacher.service.js";
import { TeacherViewType } from "../types/teacher/teacher.types.js";

@injectable()
export class TeacherController {
  constructor(
    @inject(TYPES.TeacherService) private teacherService: TeacherService,
  ) {}

  async deleteTeacher(
    req: RequestWithParams<ParamsType>,
    res: ResponseWithData<TeacherViewType>,
    next: NextFunction,
  ) {
    try {
      await this.teacherService.deleteTeacher(req.params.id);
      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  }
  // async getAllTeachers(
  //   req: RequestWithParams<ParamsType>,
  //   res: Response,
  //   next: NextFunction,
  // ) {}
}
