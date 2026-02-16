import { useAuthSessionStore } from "../store/authSession.store.ts";
import { Navigate } from "react-router-dom";

export const RoleIndexRedirect = () => {
  const user = useAuthSessionStore((s) => s.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return user.role === "teacher" ? (
    <Navigate to="/teacher/my-dashboard" replace />
  ) : (
    <Navigate to="/clients-dashboard" replace />
  );
};
