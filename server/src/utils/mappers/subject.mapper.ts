import { WithId } from "mongodb";
import { SubjectsTypeDB } from "../../db/schemes/types/subjects.types.js";
import { SubjectsViewType } from "../../types/subjects/subjects.type.js";

export const subjectsMapper = (
  subject: WithId<SubjectsTypeDB>,
): SubjectsViewType => {
  return {
    id: subject.id,
    name: subject.name,
  };
};
