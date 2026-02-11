import type { RouteObject } from "react-router-dom";
import { authRoutesVariables } from "./pathVariables";
import { SignUpPage } from "../../pages/signUpPage/SignUpPage";
import { LoginPage } from "../../pages/loginPage/LoginPage";
import { RecoveryPage } from "../../pages/recoveryPage/RecoveryPage";
import { ResetPasswordPage } from "../../pages/resetPasswordPage/resetPasswordPage";

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

  // { path: `${authRoutesVariables.recovery}`, element: <RecoveryPage /> },
  {
    path: `${authRoutesVariables.recoveryStudent}`,
    element: <RecoveryPage role="student" />,
  },
  {
    path: `${authRoutesVariables.recoveryTeacher}`,
    element: <RecoveryPage role="teacher" />,
  },
  {
    path: `${authRoutesVariables.resetPassword}`,
    element: <ResetPasswordPage />,
  },
];
