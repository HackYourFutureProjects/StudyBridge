import { Navigate, type RouteObject } from "react-router-dom";
import { privatesRoutesVariables } from "./pathVariables";
import { ClientsDashboard } from "../../pages/ClientsDashboard/ClientsDashboard";

export const privateRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to={privatesRoutesVariables.dashboard} replace />,
  },
  { path: "/clients-dashboard", element: <ClientsDashboard /> },
];
