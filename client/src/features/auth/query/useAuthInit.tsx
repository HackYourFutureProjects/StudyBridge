import { useAuthSessionStore } from "../../../store/authSession.store";
import { useEffect } from "react";
import { refreshApi } from "../../../api/auth/auth.api";

export const useAuthInit = () => {
  const setAccessToken = useAuthSessionStore((s) => s.setAccessToken);
  const clearSession = useAuthSessionStore((s) => s.clearSession);

  useEffect(() => {
    (async () => {
      try {
        const { accessToken } = await refreshApi();
        setAccessToken(accessToken);
      } catch {
        clearSession();
      }
    })();
  }, [setAccessToken, clearSession]);
};
