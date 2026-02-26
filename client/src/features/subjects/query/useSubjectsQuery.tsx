import { useNotificationStore } from "../../../store/notification.store.ts";
import { useQuery } from "@tanstack/react-query";
import { subjectsKey } from "../../queryKeys.ts";
import { useEffect } from "react";
import { getErrorMessage } from "../../../util/ErrorUtil.ts";
import { getAllSubjects } from "../../../api/subjects/subjects.api.ts";

export function useSubjectsQuery() {
  const notifyError = useNotificationStore((s) => s.error);

  const query = useQuery({
    queryKey: subjectsKey.all,
    queryFn: getAllSubjects,
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error);
      notifyError(msg ?? "Failed to load subjects");
    }
  }, [query.isError, query.isSuccess, query.error, notifyError]);

  return query;
}
