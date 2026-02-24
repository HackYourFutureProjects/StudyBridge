import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../../../api/auth/auth.api";
import { triggerLogout } from "../../../api/auth/logoutBus";
import { useNotificationStore } from "../../../store/notification.store.ts";
import { getErrorMessage } from "../../../util/ErrorUtil.ts";

/**
 * This is a custom hook for logging out a user.
 */

export function useLogoutMutation() {
  const notifyError = useNotificationStore((s) => s.error);
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      localStorage.removeItem("hadSession");
      triggerLogout();
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg);
    },
  });
}
