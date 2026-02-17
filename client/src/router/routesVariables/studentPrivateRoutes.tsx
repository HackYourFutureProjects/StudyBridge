import { RouteObject } from "react-router-dom";
import { ClientsDashboard } from "../../pages/ClientsDashboard/ClientsDashboard.tsx";
import { ClientsClasses } from "../../pages/ClientsClasses/ClientsClasses.tsx";
import { ClientsAppointments } from "../../pages/clientsAppointments/ClientsAppointments.tsx";
import { ClientsBilling } from "../../pages/clientsBilling/ClientsBilling.tsx";
import { studentPrivatesRoutesVariables } from "./pathVariables.ts";

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
