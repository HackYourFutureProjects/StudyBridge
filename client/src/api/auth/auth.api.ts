import { LoginFinalType, RegisterFinalType, UserType } from "./types";
import { apiAuth, apiProtected } from "../api";

export async function registerStudentApi(data: RegisterFinalType) {
  await apiAuth.post("/api/auth/registration-student", data);
}

export async function registerTeacherApi(data: RegisterFinalType) {
  await apiAuth.post("/api/auth/registration-teacher", data);
}

export async function loginTeacherApi(data: LoginFinalType) {
  const res = await apiAuth.post("/api/auth/login-teacher", data);
  return res.data as { accessToken: string };
}
export async function loginStudentApi(data: LoginFinalType) {
  const res = await apiAuth.post("/api/auth/login-student", data);
  return res.data as { accessToken: string };
}

export async function meApi() {
  const res = await apiProtected.get<UserType>("/api/auth/me");
  return res.data;
}

export async function refreshApi() {
  const res = await apiProtected.post("/api/auth/refresh-token");
  return res.data as { accessToken: string };
}
