import { LoginFormTypes } from "../auth/types.ts";
import { apiProtected, apiPublic } from "../api.ts";
import { TeacherStatus } from "../teacher/teacher.type.ts";

export async function loginModeratorApi(data: LoginFormTypes) {
  const res = await apiPublic.post("/api/moderator/auth/login", data);
  return res.data as { accessToken: string };
}

export async function moderatorChangeTeacherStatusApi({
  id,
  status,
}: {
  id: string;
  status: TeacherStatus;
}) {
  return await apiProtected.patch(`/api/moderator/teachers/${id}/status`, {
    status,
  });
}
