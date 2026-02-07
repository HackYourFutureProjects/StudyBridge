import { useAuthSessionStore } from "../../../store/authSession.store";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { meApi } from "../../../api/auth/auth.api";
import { useEffect } from "react";
import { UserType } from "../../../api/auth/types";

export function useMeQuery() {
  const setSession = useAuthSessionStore((s) => s.setSession);
  const clearSession = useAuthSessionStore((s) => s.clearSession);

  const query = useQuery<UserType>({
    queryKey: queryKeys.me,
    queryFn: meApi,
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setSession(query.data, (query.data as UserType).role ?? "student");
    }
  }, [query.dataUpdatedAt]);

  useEffect(() => {
    if (query.isError) {
      clearSession();
    }
  }, [query.isError, clearSession]);

  return query;
}
