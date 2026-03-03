import { useAuthSessionStore } from "../store/authSession.store.ts";
import { Navigate, useLocation } from "react-router-dom";
import {
  moderatorPrivatesRoutesVariables,
  teacherPrivatesRoutesVariables,
} from "./routesVariables/pathVariables.ts";

export const RoleIndexRedirect = () => {
  const user = useAuthSessionStore((s) => s.user);
  const location = useLocation();
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (user.role === "teacher") {
    return (
      <Navigate
        to={`/teacher/${teacherPrivatesRoutesVariables.dashboard}`}
        replace
      />
    );
  } else if (user.role === "student") {
    return <Navigate to={`/clients-dashboard`} replace />;
  } else if (user.role === "moderator") {
    return (
      <Navigate
        to={`/moderator/${moderatorPrivatesRoutesVariables.teachers}`}
        replace
      />
    );
  }
};
