import { apiPublic } from "../api.ts";
import { TeacherOutputModel, TeachersQuery } from "./teacher.type.ts";

export async function getAllTeachersApi(query: TeachersQuery) {
  const res = await apiPublic.get<TeacherOutputModel>("/api/teachers", {
    params: query,
  });

  return res.data;
}
