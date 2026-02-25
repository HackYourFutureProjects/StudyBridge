import React from "react";
import AppointmentsIcon from "../icons/Appointments";
import DashboardIcon from "../icons/Dashboard";
import Chat from "../icons/Chat";
import UsersIcon from "../icons/UsersIcon";
// import VideoCallIcon from "../icons/VideoCallIcon";
import {
  chatRoutes,
  studentBase,
  studentPrivatesRoutesVariables,
  teacherBase,
  teacherPrivatesRoutesVariables,
} from "../../router/routesVariables/pathVariables.ts";
import { joinPath } from "../../util/joinPath.util.ts";

export type MenuItem = {
  name: string;
  link: string;
  icon: React.ElementType;
};

export const defaultStudentMenuItems: MenuItem[] = [
  {
    name: "Dashboard",
    link: joinPath(studentBase, studentPrivatesRoutesVariables.dashboard),
    icon: DashboardIcon,
  },
  {
    name: "Appointments",
    link: joinPath(studentBase, studentPrivatesRoutesVariables.appointments),
    icon: AppointmentsIcon,
  },
  // {
  //   name: "Video Call",
  //   link: joinPath(studentBase, studentPrivatesRoutesVariables.videoCall),
  //   icon: VideoCallIcon,
  // },
  {
    name: "My Profile",
    link: joinPath(studentBase, studentPrivatesRoutesVariables.profile),
    icon: UsersIcon,
  },
  {
    name: "Chat",
    link: joinPath(studentBase, chatRoutes.root),
    icon: Chat,
  },
];

export const defaultTeacherMenuItems: MenuItem[] = [
  {
    name: "Dashboard",
    link: joinPath(teacherBase, teacherPrivatesRoutesVariables.dashboard),
    icon: DashboardIcon,
  },
  {
    name: "Appointments",
    link: joinPath(teacherBase, teacherPrivatesRoutesVariables.appointments),
    icon: AppointmentsIcon,
  },
  // {
  //   name: "Video Call",
  //   link: joinPath(teacherBase, teacherPrivatesRoutesVariables.videoCall),
  //   icon: VideoCallIcon,
  // },
  {
    name: "My Profile",
    link: joinPath(teacherBase, teacherPrivatesRoutesVariables.profile),
    icon: UsersIcon,
  },
  {
    name: "Chat",
    link: joinPath(teacherBase, chatRoutes.root),
    icon: Chat,
  },
];
