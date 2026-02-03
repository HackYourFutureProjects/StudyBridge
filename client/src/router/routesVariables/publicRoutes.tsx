import type { RouteObject } from "react-router-dom";
import { publicRoutesVariables } from "./pathVariables";

export const publicRoutes: RouteObject[] = [
  { index: true, element: <div>Home</div> },
  { path: `${publicRoutesVariables.teachers}`, element: <div>Teachers</div> },
  {
    path: `${publicRoutesVariables.teacher}`,
    element: <div>Teacher page</div>,
  },
];
