import type { RouteObject } from "react-router-dom";
import { authRoutesVariables } from "./pathVariables";
import { SignUpPage } from "../../pages/signUpPage/SignUpPage";

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
    element: <SignUpPage role="student" />,
  },
  {
    path: `${authRoutesVariables.registerTutor}`,
    element: <SignUpPage role="tutor" />,
  },

  { path: `${authRoutesVariables.recovery}`, element: <div>Recovery</div> },
];
