import { useAuthSessionStore } from "../store/authSession.store.ts";
import { Navigate } from "react-router-dom";
import { teacherPrivatesRoutesVariables } from "./routesVariables/pathVariables.ts";

export const RoleIndexRedirect = () => {
  const user = useAuthSessionStore((s) => s.user);

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return user.role === "teacher" ? (
    <Navigate
      to={`/teacher/${teacherPrivatesRoutesVariables.dashboard}`}
      replace
    />
  ) : (
    <Navigate to={`/clients-dashboard`} replace />
  );
};
