import { authRoutesVariables } from "../router/routesVariables/pathVariables.ts";
import Teacher from "../components/icons/Teacher.tsx";
import Student from "../components/icons/Student.tsx";
import { linkOption } from "../types/linkOptionsType.ts";
import Dashboard from "../components/icons/Dashboard.tsx";
import LogoutIcon from "../components/icons/LogoutIcon.tsx";
export const linkOptions: linkOption[] = [
  {
    id: "1",
    title: "Sign in as a student",
    link: authRoutesVariables.loginStudent,
    icon: Teacher,
  },
  {
    id: "2",
    title: "Sign in as a teacher",
    link: authRoutesVariables.loginTutor,
    icon: Student,
  },
];

export const makePrivateLinkOptions = (
  open: (name: "logout") => void,
): linkOption[] => [
  {
    id: "1",
    title: "My account",
    link: "/app",
    icon: Dashboard,
  },
  {
    id: "2",
    title: "Log out",
    icon: LogoutIcon,
    actionCallback: () => open("logout"),
  },
];
