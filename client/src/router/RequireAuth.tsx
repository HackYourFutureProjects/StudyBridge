import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const isLoading = false;
  const isAuth = true;
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuth) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
