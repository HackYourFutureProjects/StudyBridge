import { TYPES } from "../composition/composition.types.js";
import { inject, injectable } from "inversify";
import { NextFunction, Response, Request } from "express";
import { SubjectsQuery } from "../repositories/queryRepositories/subjects.query.js";

@injectable()
export class SubjectsController {
  constructor(
    @inject(TYPES.SubjectsQuery) private studentService: SubjectsQuery,
  ) {}

  async getSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await this.studentService.getAllSubjects();
      if (!subjects) {
        return res.status(404).json({ message: "Subjects not found" });
      }

      return res.status(200).json(subjects);
    } catch (err) {
      return next(err);
    }
  }
}
