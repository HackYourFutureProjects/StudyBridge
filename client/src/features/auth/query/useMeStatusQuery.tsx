import { useAuthSessionStore } from "../../../store/authSession.store.ts";
import { useQuery } from "@tanstack/react-query";
import { UserType } from "../../../api/auth/types.ts";
import { queryKeys } from "../../queryKeys.ts";
import { meApi } from "../../../api/auth/auth.api.ts";

export function useMeStatusQuery() {
  const accessToken = useAuthSessionStore((s) => s.accessToken);

  return useQuery<UserType>({
    queryKey: queryKeys.me,
    queryFn: meApi,
    enabled: !!accessToken,
    retry: false,
  });
}
