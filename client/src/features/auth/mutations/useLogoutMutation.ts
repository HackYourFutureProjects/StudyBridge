import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../../../api/auth/auth.api";
import { triggerLogout } from "../../../api/auth/logoutBus";

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      triggerLogout();
    },
  });
}
