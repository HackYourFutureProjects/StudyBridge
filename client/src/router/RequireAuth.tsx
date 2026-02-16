import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthSessionStore } from "../store/authSession.store.ts";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const isLoading = false;
  const isAuth = useAuthSessionStore((s) => s.user !== null);

  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuth) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
