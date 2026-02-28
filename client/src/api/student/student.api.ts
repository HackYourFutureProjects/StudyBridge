import { apiProtected } from "../api";
import { StudentType, UpdateStudentProfile } from "./student.type";

export const getMyStudentProfile = async (): Promise<StudentType> => {
  const response = await apiProtected.get("/api/students/me");
  return response.data;
};

export const getStudentByIdApi = async (id: string): Promise<StudentType> => {
  const response = await apiProtected.get(`/api/students/${id}`);
  return response.data;
};

export const updateMyStudentProfile = async (
  data: UpdateStudentProfile,
): Promise<StudentType> => {
  const response = await apiProtected.put("/api/students/me", data);
  return response.data;
};
