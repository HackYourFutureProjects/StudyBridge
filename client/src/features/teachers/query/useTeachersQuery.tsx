import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { TeachersQuery } from "../../../api/teacher/teacher.type.ts";
import { queryKeys } from "../../queryKeys.ts";
import { getAllTeachersApi } from "../../../api/teacher/teacher.api.ts";
import { useEffect } from "react";
import { useNotificationStore } from "../../../store/notification.store.ts";
import { getErrorMessage } from "../../../util/ErrorUtil.ts";

export function useTeachersQuery(params: TeachersQuery) {
  const notifyError = useNotificationStore((s) => s.error);

  const query = useQuery({
    queryKey: queryKeys.teachers.publicList(params),
    queryFn: () => getAllTeachersApi(params),
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
