import { RouteObject } from "react-router-dom";

import { teacherPrivatesRoutesVariables } from "./pathVariables.ts";
import { TeacherDashboard } from "../../pages/privetTeachersPages/teacherDashboard/TeacherDashboard.tsx";
import { ClientsClasses } from "../../pages/privateStudentsPages/ClientsClasses/ClientsClasses.tsx";
import { ClientsBilling } from "../../pages/privateStudentsPages/clientsBilling/ClientsBilling.tsx";
import { TeacherProfile } from "../../pages/privetTeachersPages/teacherProfile/TeacherProfile.tsx";
import { TeacherAppointments } from "../../pages/privetTeachersPages/teacherAppointments/TeacherAppointments.tsx";

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
