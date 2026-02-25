import { useEffect } from "react";
import { refreshApi } from "../../../api/auth/auth.api";
import { useAuthSessionStore } from "../../../store/authSession.store.ts";

export const useAuthInit = () => {
  const setAccessToken = useAuthSessionStore((s) => s.setAccessToken);
  const clearSession = useAuthSessionStore((s) => s.clearSession);
  const setAuthInitDone = useAuthSessionStore((s) => s.setAuthInitDone);
  useEffect(() => {
    const hadSession = localStorage.getItem("hadSession") === "1";
    if (!hadSession) {
      clearSession();
      setAuthInitDone(true);
      return;
    }
    (async () => {
      try {
        const { accessToken } = await refreshApi();
        setAccessToken(accessToken);
      } catch {
        localStorage.removeItem("hadSession");
        clearSession();
      } finally {
        setAuthInitDone(true);
      }
    })();
  }, [setAccessToken, clearSession, setAuthInitDone]);
};
