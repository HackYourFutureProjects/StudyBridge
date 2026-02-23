import { inject, injectable } from "inversify";
import {
  ParamsType,
  RequestWithBody,
  RequestWithParams,
} from "../types/common.types.js";
import { NextFunction, Response } from "express";
import { TYPES } from "../composition/composition.types.js";
import { StudentService } from "../services/student/student.service.js";
import { UpdateStudentProfileType } from "../types/student/student.types.js";

@injectable()
export class StudentController {
  constructor(
    @inject(TYPES.StudentService) private studentService: StudentService,
  ) {}

  async getMyProfile(
    req: RequestWithParams<ParamsType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const student = await this.studentService.getStudentById(userId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      return res.status(200).json(student);
    } catch (err) {
      return next(err);
    }
  }

  async updateMyProfile(
    req: RequestWithBody<UpdateStudentProfileType>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.auth?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updated = await this.studentService.updateStudentProfile(
        userId,
        req.body,
      );

      if (!updated) {
        return res.status(404).json({ message: "Student not found" });
      }

      return res.status(200).json(updated);
    } catch (err) {
      return next(err);
    }
  }

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
