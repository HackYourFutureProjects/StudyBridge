import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthSessionStore } from "../store/authSession.store.ts";
import { Role } from "../api/auth/types.ts";

export const RequireRole = ({
  allow,
  children,
}: {
  allow: Role[];
  children: ReactNode;
}) => {
  const location = useLocation();
  const user = useAuthSessionStore((s) => s.user);

  const isLoading = false;

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const role = user.role as Role;

  if (!allow.includes(role)) {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
