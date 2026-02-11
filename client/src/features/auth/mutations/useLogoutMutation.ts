import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../../../api/auth/auth.api";
import { triggerLogout } from "../../../api/auth/logoutBus";

{
  /*
  This is a custom hook for logging out a user.
*/
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      localStorage.removeItem("hadSession");
      triggerLogout();
    },
  });
}
