import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import {
  getTeacherByIdApi,
  getTeacherByIdForModeratorApi,
} from "../../../api/teacher/teacher.api";
import { useAuthSessionStore } from "../../../store/authSession.store.ts";

export const useTeacherQuery = (teacherId: string) => {
  const role = useAuthSessionStore((s) => s.user?.role);
  const isModerator = role === "moderator";

  return useQuery({
    queryKey: isModerator
      ? queryKeys.teacherModerator(teacherId)
      : queryKeys.teacherPublic(teacherId),
    queryFn: () =>
      isModerator
        ? getTeacherByIdForModeratorApi(teacherId)
        : getTeacherByIdApi(teacherId),
    enabled: Boolean(teacherId),
    retry: false,
  });
};
