import { TYPES } from "../composition/composition.types.js";
import { inject, injectable } from "inversify";
import { NextFunction, Response, Request } from "express";
import { SubjectsQuery } from "../repositories/queryRepositories/subjects.query.js";

@injectable()
export class SubjectsController {
  constructor(
    @inject(TYPES.SubjectsQuery) private subjectsQuery: SubjectsQuery,
  ) {}

  async getSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await this.subjectsQuery.getAllSubjects();

      return res.status(200).json(subjects);
    } catch (err) {
      return next(err);
    }
  }
}
