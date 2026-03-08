import type { RouteObject } from "react-router-dom";
import { publicRoutesVariables } from "./pathVariables";
import { Home } from "../../pages/home/Home";
import { TeacherDetail } from "../../pages/teacherDetail/teacherDetail";
import { TeachersPage } from "../../pages/teachersPage/TeachersPage";
import { PrivacyPolicyPage } from "../../pages/legal/PrivacyPolicyPage";
import { TermsAndConditionsPage } from "../../pages/legal/TermsAndConditionsPage";
import { ReturnPolicyPage } from "../../pages/legal/ReturnPolicyPage";

export const publicRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
  { path: `${publicRoutesVariables.teachers}`, element: <TeachersPage /> },
  {
    path: `${publicRoutesVariables.teacher}`,
    element: <TeacherDetail />,
  },

  {
    path: `${publicRoutesVariables.privacyPolicy}`,
    element: <PrivacyPolicyPage />,
  },
  {
    path: `${publicRoutesVariables.termsAndConditions}`,
    element: <TermsAndConditionsPage />,
  },
  {
    path: `${publicRoutesVariables.returnPolicy}`,
    element: <ReturnPolicyPage />,
  },
];
