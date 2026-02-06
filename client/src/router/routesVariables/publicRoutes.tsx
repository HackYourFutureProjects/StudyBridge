import type { RouteObject } from "react-router-dom";
import { publicRoutesVariables } from "./pathVariables";
import { Home } from "../../pages/home/Home";
import { TeacherDetail } from "../../pages/teacherDetail/teacherDetail";

export const publicRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
  { path: `${publicRoutesVariables.teachers}`, element: <div>Teachers</div> },
  {
    path: `${publicRoutesVariables.teacher}`,
    element: <TeacherDetail />,
  },
];
