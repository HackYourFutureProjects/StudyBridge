import { apiPublic } from "../api.ts";
import {
  TeacherOutputModel,
  TeachersQuery,
  TeacherType,
} from "./teacher.type.ts";

export async function getAllTeachersApi(query: TeachersQuery) {
  const res = await apiPublic.get<TeacherOutputModel>("/api/teachers", {
    params: query,
  });

  return res.data;
}

export async function getTeacherByIdApi(teacherId: string) {
  const res = await apiPublic.get<TeacherType>(`/api/teachers/${teacherId}`);
  return res.data;
}
