import { injectable } from "inversify";
import { SubjectsModel } from "../../db/schemes/subjects.schema.js";
import { subjectsMapper } from "../../utils/mappers/subject.mapper.js";

@injectable()
export class SubjectsQuery {
  async getAllSubjects() {
    try {
      const subjects = await SubjectsModel.find().lean();
      return subjects.map(subjectsMapper);
    } catch (err: unknown) {
      throw new Error("Something went wrong with getting all subjects", {
        cause: err,
      });
    }
  }
}
