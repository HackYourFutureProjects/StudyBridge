import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthSessionStore } from "../store/authSession.store.ts";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const user = useAuthSessionStore((s) => s.user);
  const accessToken = useAuthSessionStore((s) => s.accessToken);
  const hadSession = localStorage.getItem("hadSession") === "1";
  const isLoading = hadSession && !user && !accessToken;
  const isAuth = Boolean(user) || Boolean(accessToken);

  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuth) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
