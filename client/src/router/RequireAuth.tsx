import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthSessionStore } from "../store/authSession.store.ts";
import { Loader } from "../components/loader/Loader.tsx";
import { ModalOverlay } from "../components/ui/modal/ModalOverlay.tsx";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const user = useAuthSessionStore((s) => s.user);
  const accessToken = useAuthSessionStore((s) => s.accessToken);
  const authInitDone = useAuthSessionStore((s) => s.authInitDone);
  const location = useLocation();

  const hadSession = localStorage.getItem("hadSession") === "1";

  if (hadSession && !authInitDone) {
    return (
      <ModalOverlay>
        <Loader />
      </ModalOverlay>
    );
  }

  const isAuth = Boolean(user) || Boolean(accessToken);

  if (!isAuth) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
