import type { RouteObject } from "react-router-dom";
import { authRoutesVariables } from "./pathVariables";

export const authRoutes: RouteObject[] = [
  {
    path: `${authRoutesVariables.loginStudent}`,
    element: <div>Login student</div>,
  },
  {
    path: `${authRoutesVariables.loginTutor}`,
    element: <div>Login student tutor</div>,
  },

  {
    path: `${authRoutesVariables.registerStudent}`,
    element: <div>Register student</div>,
  },
  {
    path: `${authRoutesVariables.registerTutor}`,
    element: <div>Register student tutor</div>,
  },

  { path: `${authRoutesVariables.recovery}`, element: <div>Recovery</div> },
];
