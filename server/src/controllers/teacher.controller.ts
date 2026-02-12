import { inject, injectable } from "inversify";
import {
  ParamsType,
  RequestWithParams,
  RequestWithQuery,
  ResponseWithData,
} from "../types/common.types.js";
import { NextFunction, Response } from "express";
import { TYPES } from "../composition/composition.types.js";
import { TeacherService } from "../services/teacher/teacher.service.js";
import { TeacherQuery } from "../repositories/queryRepositories/teacher.query.js";
import {
  QueryTeacherInput,
  TeacherOutputModel,
} from "../types/teacher/teacher.types.js";

@injectable()
export class TeacherController {
  constructor(
    @inject(TYPES.TeacherService) private teacherService: TeacherService,
    @inject(TYPES.TeacherQuery) private teacherQuery: TeacherQuery,
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

  async getAllTeachers(
    req: RequestWithQuery<QueryTeacherInput>,
    res: ResponseWithData<TeacherOutputModel>,
    next: NextFunction,
  ) {
    try {
      const sortData: QueryTeacherInput = {
        subject: req.query.subject,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        maxRating: req.query.maxRating,
      };

      const teachers = await this.teacherQuery.getAllTeachers(sortData);

      return res.status(200).send(teachers);
    } catch (err) {
      return next(err);
    }
  }
}
