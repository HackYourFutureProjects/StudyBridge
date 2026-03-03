import { LoginFormTypes } from "../auth/types.ts";
import { apiPublic } from "../api.ts";

export async function loginModeratorApi(data: LoginFormTypes) {
  const res = await apiPublic.post("/api/moderator/auth/login", data);
  return res.data as { accessToken: string };
}
