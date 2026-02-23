import React from "react";
import { Link, useLocation } from "react-router-dom";
import AppointmentsIcon from "../icons/Appointments";
import DashboardIcon from "../icons/Dashboard";
import LessonsIcon from "../icons/Lessons";
import Chat from "../icons/Chat";
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
  {
    name: "My Classes",
    link: joinPath(studentBase, studentPrivatesRoutesVariables.classes),
    icon: LessonsIcon,
  },
  {
    name: "Billings",
    link: joinPath(studentBase, studentPrivatesRoutesVariables.billing),
    icon: LessonsIcon,
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
  {
    name: "My Classes",
    link: joinPath(teacherBase, teacherPrivatesRoutesVariables.classes),
    icon: LessonsIcon,
  },
  {
    name: "Chat",
    link: joinPath(teacherBase, chatRoutes.root),
    icon: Chat,
  },
];

type SidebarProps = {
  items?: MenuItem[];
  variant: "mobile" | "desktop";
};

export const Sidebar = ({ items, variant }: SidebarProps) => {
  const { pathname } = useLocation();
  const menuItems = items ?? defaultStudentMenuItems;

  if (variant === "mobile") {
    return (
      <aside className="fixed bottom-0 left-0 z-50 w-full bg-[#211c27] h-17.5 border-t border-[#0F0E13]">
        <div className="mx-auto max-w-360 h-full">
          <ul className="flex h-full items-center justify-around">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.link;

              return (
                <li key={item.name} className="flex-1">
                  <Link
                    to={item.link}
                    className={`flex flex-col items-center justify-center gap-1 h-full transition-all
                      ${isActive ? "text-[#7839CD]" : "text-light-100"}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[12px] font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    );
  }

  // desktop
  return (
    <aside className="w-[218px] h-full  pt-[30px]">
      <ul className="flex flex-col gap-[10px]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.link;

          return (
            <li key={item.name} className="px-3">
              <Link
                to={item.link}
                className={`flex items-center gap-[10px] py-[13px] px-[12px] rounded-[5px] transition-all
                  ${isActive ? "bg-[#F1EEFE] text-[#7839CD]" : "text-[#474747] hover:bg-[#2A2433]"}
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[16px] font-medium">{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
