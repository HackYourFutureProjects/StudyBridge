import { TeachersForModeratorQuery } from "../../../api/teacher/teacher.type.ts";
import { useNotificationStore } from "../../../store/notification.store.ts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys.ts";
import { getAllTeachersForModeratorApi } from "../../../api/teacher/teacher.api.ts";
import { useEffect } from "react";
import { getErrorMessage } from "../../../util/ErrorUtil.ts";

export function useTeachersForModeratorQuery(
  params: TeachersForModeratorQuery,
) {
  const notifyError = useNotificationStore((s) => s.error);

  const query = useQuery({
    queryKey: queryKeys.teachersList(params),
    queryFn: () => getAllTeachersForModeratorApi(params),
    retry: false,
    placeholderData: keepPreviousData,
    staleTime: 20 * 60 * 1000,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error);
      notifyError(msg ?? "Failed to load teachers");
    }
  }, [query.isError, query.isSuccess, query.error, notifyError]);

  return query;
}
