import { useAuthSessionStore } from "../store/authSession.store.ts";
import { Navigate } from "react-router-dom";
import {
  studentPrivatesRoutesVariables,
  teacherPrivatesRoutesVariables,
} from "./routesVariables/pathVariables.ts";

export const RoleIndexRedirect = () => {
  const user = useAuthSessionStore((s) => s.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return user.role === "teacher" ? (
    <Navigate to={teacherPrivatesRoutesVariables.dashboard} replace />
  ) : (
    <Navigate to={studentPrivatesRoutesVariables.dashboard} replace />
  );
};
