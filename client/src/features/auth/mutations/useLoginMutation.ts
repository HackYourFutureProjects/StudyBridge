import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { loginStudentApi, loginTeacherApi } from "../../../api/auth/auth.api";
import { queryKeys } from "../../queryKeys";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../util/ErrorUtil";
import { LoginFinalType, Role } from "../../../api/auth/types";
import { useNotificationStore } from "../../../store/notification.store";

export function useLoginMutation(role: Role) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthSessionStore((s) => s.setAccessToken);
  const success = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);
  const mutationFn = (data: LoginFinalType) => {
    return role === "teacher" ? loginTeacherApi(data) : loginStudentApi(data);
  };

  return useMutation({
    mutationFn,
    onSuccess: async ({ accessToken }) => {
      setAccessToken(accessToken);
      success("Successfully logged in");
      localStorage.setItem("hadSession", "1");
      navigate("/", { replace: true });
      await qc.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg);
    },
  });
}
