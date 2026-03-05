import { useMutation } from "@tanstack/react-query";
import { useAuthSessionStore } from "../../../store/authSession.store.ts";
import { useNotificationStore } from "../../../store/notification.store.ts";
import { Intent, Role } from "../../../api/auth/types.ts";
import {
  googleLoginApi,
  googleRegisterApi,
} from "../../../api/auth/auth.api.ts";
import { getErrorMessage } from "../../../util/ErrorUtil.ts";
import { useNavigate } from "react-router-dom";

type useLoginMutationProps = {
  onClose?: () => void;
  intent: Intent;
  role: Role;
};

export function useGoogleLoginMutation({
  intent,
  role,
  onClose,
}: useLoginMutationProps) {
  const setAccessToken = useAuthSessionStore((s) => s.setAccessToken);
  const notifyError = useNotificationStore((s) => s.error);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (idToken: string) => {
      return intent === "login"
        ? googleLoginApi({ idToken, role })
        : googleRegisterApi({ idToken, role });
    },
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);
      localStorage.setItem("hadSession", "1");
      navigate("/", { replace: true });
      onClose?.();
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg);
    },
  });
}
