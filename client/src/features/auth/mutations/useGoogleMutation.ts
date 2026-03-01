import { useMutation } from "@tanstack/react-query";
import { useAuthSessionStore } from "../../../store/authSession.store.ts";
import { useNotificationStore } from "../../../store/notification.store.ts";
import { Intent, Role } from "../../../api/auth/types.ts";
import {
  googleLoginApi,
  googleRegisterApi,
} from "../../../api/auth/auth.api.ts";
import { getErrorMessage } from "../../../util/ErrorUtil.ts";

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

  return useMutation({
    mutationFn: (idToken: string) => {
      return intent === "login"
        ? googleLoginApi({ idToken, role })
        : googleRegisterApi({ idToken, role });
    },
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);
      localStorage.setItem("hadSession", "1");
      onClose?.();
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg);
    },
  });
}
