import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { logoutApi } from "../../../api/auth/auth.api";
import { useNavigate } from "react-router-dom";

export function useLogoutMutation() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const clearSession = useAuthSessionStore((s) => s.clearSession);

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: async () => {
      clearSession();
      localStorage.removeItem("hadSession");
      qc.clear();
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      clearSession();
      localStorage.removeItem("hadSession");
      qc.clear();
      navigate("/", { replace: true });
    },
  });
}
