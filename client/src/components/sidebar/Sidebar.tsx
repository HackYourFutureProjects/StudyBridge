import React from "react";
import { Link, useLocation } from "react-router-dom";

import BillingIcon from "../icons/Billing";
import AppointmentsIcon from "../icons/Appointments";
import DashboardIcon from "../icons/Dashboard";
import LessonsIcon from "../icons/Lessons";
import SettingsIcon from "../icons/Settings";
import VideoCallIcon from "../icons/VideoCall";
import UsersIcon from "../icons/UsersIcon";
import Chat from "../icons/Chat";

export type MenuItem = {
  name: string;
  link: string;
  icon: React.ElementType;
};

export const defaultStudentMenuItems: MenuItem[] = [
  { name: "Dashboard", link: "/clients-dashboard", icon: DashboardIcon },
  {
    name: "Appointments",
    link: "/clients-dashboard/clients-appointments",
    icon: AppointmentsIcon,
  },
  {
    name: "My Classes",
    link: "/clients-dashboard/student-classes",
    icon: LessonsIcon,
  },
  {
    name: "Billings",
    link: "/clients-dashboard/clients-billing",
    icon: BillingIcon,
  },
  {
    name: "Video call",
    link: "/clients-dashboard/video-call",
    icon: VideoCallIcon,
  },
  { name: "Settings", link: "/clients-dashboard/settings", icon: SettingsIcon },
  { name: "Chat", link: "/clients-dashboard/chat", icon: Chat },
];

export const defaultTeacherMenuItems: MenuItem[] = [
  { name: "Dashboard", link: "/teacher/my-dashboard", icon: DashboardIcon },
  {
    name: "Appointments",
    link: "/teacher/teacher-appointments",
    icon: AppointmentsIcon,
  },
  { name: "My Classes", link: "/teacher/my-classes", icon: LessonsIcon },
  { name: "My Students", link: "/teacher/my-students", icon: UsersIcon },
  { name: "My Profile", link: "/teacher/profile", icon: UsersIcon },
  { name: "Billings", link: "/teacher/my-billings", icon: BillingIcon },
  { name: "Video call", link: "/teacher/video-call", icon: VideoCallIcon },
  { name: "Chat", link: "/teacher/chat", icon: Chat },
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
