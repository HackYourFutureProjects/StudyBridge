import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthSessionStore } from "../../../store/authSession.store.ts";
import { useNotificationStore } from "../../../store/notification.store.ts";
import { LoginFormTypes } from "../../../api/auth/types.ts";
import { queryKeys } from "../../queryKeys.ts";
import { getErrorMessage } from "../../../util/ErrorUtil.ts";
import { loginModeratorApi } from "../../../api/moderator/moderator.api.ts";

export function useLoginModeratorMutation() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthSessionStore((s) => s.setAccessToken);
  const success = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  return useMutation({
    mutationFn: (data: LoginFormTypes) => loginModeratorApi(data),
    onSuccess: async ({ accessToken }) => {
      setAccessToken(accessToken);
      success("Successfully logged in");
      localStorage.setItem("hadSession", "1");
      await qc.invalidateQueries({ queryKey: queryKeys.me });
      navigate("/", { replace: true });
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg);
    },
  });
}
