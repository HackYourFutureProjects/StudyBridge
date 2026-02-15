import { Navigate, type RouteObject } from "react-router-dom";
import { privatesRoutesVariables } from "./pathVariables";
import { ClientsDashboard } from "../../pages/ClientsDashboard/ClientsDashboard";
import { ClientsClasses } from "../../pages/ClientsClasses/ClientsClasses";
import { ClientsBilling } from "../../pages/clientsBilling/ClientsBilling";
import { TeacherDashboard } from "../../pages/teacherDashboard/TeacherDashboard";
import { ClientsAppointments } from "../../pages/clientsAppointments/ClientsAppointments";
import { TeacherAppointments } from "../../pages/teacherAppointments/TeacherAppointments";
import { TeacherProfile } from "../../pages/teacherProfile/TeacherProfile";

export const privateRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to={privatesRoutesVariables.dashboard} replace />,
  },
  { path: "/clients-dashboard", element: <ClientsDashboard /> },
  { path: "/student-classes", element: <ClientsClasses /> },
  { path: "/clients-appointments", element: <ClientsAppointments /> },
  { path: "/clients-billing", element: <ClientsBilling /> },
  { path: "/teacher/my-dashboard", element: <TeacherDashboard /> },
  { path: "/teacher/my-classes", element: <ClientsClasses /> },
  { path: "/teacher/my-students", element: <ClientsClasses /> },
  { path: "/teacher/my-billings", element: <ClientsBilling /> },
  { path: "/teacher/profile", element: <TeacherProfile /> },
  { path: "/teacher-appointments", element: <TeacherAppointments /> },
];
