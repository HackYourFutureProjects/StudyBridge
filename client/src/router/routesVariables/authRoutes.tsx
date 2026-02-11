import type { RouteObject } from "react-router-dom";
import { authRoutesVariables } from "./pathVariables";
import { SignUpPage } from "../../pages/signUpPage/SignUpPage";
import { LoginPage } from "../../pages/loginPage/LoginPage";
import { RecoveryPage } from "../../pages/recoveryPage/RecoveryPage";

export const authRoutes: RouteObject[] = [
  {
    path: `${authRoutesVariables.loginStudent}`,
    element: <LoginPage role="student" />,
  },
  {
    path: `${authRoutesVariables.loginTutor}`,
    element: <LoginPage role="teacher" />,
  },

  {
    path: `${authRoutesVariables.registerStudent}`,
    element: <SignUpPage role="student" />,
  },
  {
    path: `${authRoutesVariables.registerTutor}`,
    element: <SignUpPage role="teacher" />,
  },

  { path: `${authRoutesVariables.recovery}`, element: <RecoveryPage /> },
];
