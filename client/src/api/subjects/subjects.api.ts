import { apiPublic } from "../api.ts";
import { SubjectsType } from "./subjects.type.ts";

export const getAllSubjects = async (): Promise<SubjectsType[]> => {
  const response = await apiPublic.get("/api/subjects");
  return response.data;
};
