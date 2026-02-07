import { Navigate, type RouteObject } from "react-router-dom";
import { privatesRoutesVariables } from "./pathVariables";
import { ClientsDashboard } from "../../pages/ClientsDashboard/ClientsDashboard";
import { StudentClasses } from "../../pages/StudentClasses/StudentClasses";
import { TeacherDashboard } from "../../pages/teacherDashboard/TeacherDashboard";
import { ClientsBilling } from "../../pages/clientsBilling/ClientsBilling";

export const privateRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to={privatesRoutesVariables.dashboard} replace />,
  },
  { path: "/clients-dashboard", element: <ClientsDashboard /> },
  { path: "/student-classes", element: <StudentClasses /> },

  { path: "teacher/my-dashboard", element: <TeacherDashboard /> },
  { path: "/clients-billing", element: <ClientsBilling /> },
];
