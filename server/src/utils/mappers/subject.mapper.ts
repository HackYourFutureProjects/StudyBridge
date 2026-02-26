import { WithId } from "mongodb";
import { SchemaDb } from "../../db/schemes/types/subjects.types.js";
import { SubjectsViewType } from "../../types/subjects/subjects.type.js";

export const subjectsMapper = (
  subjects: WithId<SchemaDb>,
): SubjectsViewType => {
  return {
    id: subjects.id,
    name: subjects.name,
  };
};
