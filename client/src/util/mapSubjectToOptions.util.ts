import { SubjectsType } from "../api/subjects/subjects.type.ts";

export type Option = {
  label: string;
  value: string;
};

export const mapSubjectsToOptions = (subjects: SubjectsType[]): Option[] => {
  return subjects.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
};
