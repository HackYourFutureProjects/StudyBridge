import { RouteObject } from "react-router-dom";
import { TeacherDashboard } from "../../pages/teacherDashboard/TeacherDashboard.tsx";
import { ClientsClasses } from "../../pages/ClientsClasses/ClientsClasses.tsx";
import { TeacherProfile } from "../../pages/teacherProfile/TeacherProfile.tsx";
import { TeacherAppointments } from "../../pages/teacherAppointments/TeacherAppointments.tsx";
import { ClientsBilling } from "../../pages/clientsBilling/ClientsBilling.tsx";
import { teacherPrivatesRoutesVariables } from "./pathVariables.ts";

export const teacherPrivateRoutes: RouteObject[] = [
  {
    path: teacherPrivatesRoutesVariables.dashboard,
    element: <TeacherDashboard />,
  },
  { path: teacherPrivatesRoutesVariables.classes, element: <ClientsClasses /> },
  {
    path: teacherPrivatesRoutesVariables.myStudents,
    element: <ClientsClasses />,
  },
  {
    path: teacherPrivatesRoutesVariables.billings,
    element: <ClientsBilling />,
  },
  { path: teacherPrivatesRoutesVariables.profile, element: <TeacherProfile /> },
  {
    path: teacherPrivatesRoutesVariables.appointments,
    element: <TeacherAppointments />,
  },
];
