import { useAuthSessionStore } from "../../../store/authSession.store";
import { useEffect } from "react";
import { refreshApi } from "../../../api/auth/auth.api";

export const useAuthInit = () => {
  const setAccessToken = useAuthSessionStore((s) => s.setAccessToken);
  const clearSession = useAuthSessionStore((s) => s.clearSession);

  useEffect(() => {
    const hadSession = localStorage.getItem("hadSession") === "1";
    if (!hadSession) {
      clearSession();
      return;
    }

    (async () => {
      try {
        const { accessToken } = await refreshApi();
        setAccessToken(accessToken);
      } catch {
        localStorage.removeItem("hadSession");
        clearSession();
      }
    })();
  }, [setAccessToken, clearSession]);
};
