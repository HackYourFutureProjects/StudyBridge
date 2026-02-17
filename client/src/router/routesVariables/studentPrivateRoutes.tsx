import { RouteObject } from "react-router-dom";
import { studentPrivatesRoutesVariables } from "./pathVariables.ts";
import { ClientsDashboard } from "../../pages/privateStudentsPages/ClientsDashboard/ClientsDashboard.tsx";
import { ClientsClasses } from "../../pages/privateStudentsPages/ClientsClasses/ClientsClasses.tsx";
import { ClientsAppointments } from "../../pages/privateStudentsPages/clientsAppointments/ClientsAppointments.tsx";
import { ClientsBilling } from "../../pages/privateStudentsPages/clientsBilling/ClientsBilling.tsx";

export const studentPrivateRoutes: RouteObject[] = [
  {
    path: studentPrivatesRoutesVariables.dashboard,
    element: <ClientsDashboard />,
  },
  {
    path: studentPrivatesRoutesVariables.classes,
    element: <ClientsClasses />,
  },
  {
    path: studentPrivatesRoutesVariables.appointments,
    element: <ClientsAppointments />,
  },
  { path: studentPrivatesRoutesVariables.billing, element: <ClientsBilling /> },
];
