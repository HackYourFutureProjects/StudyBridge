import { Navigate, type RouteObject } from "react-router-dom";
import { privatesRoutesVariables } from "./pathVariables";

export const privateRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to={privatesRoutesVariables.dashboard} replace />,
  },
];
