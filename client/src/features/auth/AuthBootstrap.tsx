import { useQueryClient } from "@tanstack/react-query";
import { useAuthSessionStore } from "../../store/authSession.store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setLogoutHandler } from "../../api/auth/logoutBus";

export function AuthBootstrap() {
  const qc = useQueryClient();
  const clearSession = useAuthSessionStore((s) => s.clearSession);
  const navigate = useNavigate();
  useEffect(() => {
    const hardLogout = () => {
      clearSession();
      qc.clear();
      navigate("/", { replace: true });
    };

    setLogoutHandler(hardLogout);
    return () => setLogoutHandler(() => {});
  }, [clearSession, qc]);

  return null;
}
