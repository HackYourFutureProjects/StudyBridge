import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthSessionStore } from "../store/authSession.store.ts";
import { Role } from "../api/auth/types.ts";
import { Loader } from "../components/loader/Loader.tsx";
import { ModalOverlay } from "../components/ui/modal/ModalOverlay.tsx";

export const RequireRole = ({
  allow,
  children,
}: {
  allow: Role[];
  children: ReactNode;
}) => {
  const location = useLocation();
  const user = useAuthSessionStore((s) => s.user);
  const authInitDone = useAuthSessionStore((s) => s.authInitDone);
  const accessToken = useAuthSessionStore((s) => s.accessToken);

  const isLoading = !authInitDone || (accessToken && !user);

  if (isLoading) {
    return (
      <ModalOverlay>
        <Loader />
      </ModalOverlay>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const role = user.role;

  if (!allow.includes(role)) {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
