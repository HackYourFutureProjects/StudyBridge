import React from "react";
import { Link, useLocation } from "react-router-dom";

import BillingIcon from "../icons/Billing";
import AppointmentsIcon from "../icons/Appointments";
import DashboardIcon from "../icons/Dashboard";
import LessonsIcon from "../icons/Lessons";
import SettingsIcon from "../icons/Settings";
import VideoCallIcon from "../icons/VideoCall";
import UsersIcon from "../icons/UsersIcon";

export type MenuItem = {
  name: string;
  link: string;
  icon: React.ElementType;
};

export const defaultStudentMenuItems: MenuItem[] = [
  { name: "Dashboard", link: "/clients-dashboard", icon: DashboardIcon },
  {
    name: "Appointments",
    link: "/clients-appointments",
    icon: AppointmentsIcon,
  },
  { name: "My Classes", link: "/student-classes", icon: LessonsIcon },
  { name: "Billings", link: "/clients-billing", icon: BillingIcon },
  { name: "Video call", link: "/video-call", icon: VideoCallIcon },
  { name: "Settings", link: "/settings", icon: SettingsIcon },
];

export const defaultTeacherMenuItems: MenuItem[] = [
  { name: "Dashboard", link: "/teacher/my-dashboard", icon: DashboardIcon },
  {
    name: "Appointments",
    link: "/teacher-appointments",
    icon: AppointmentsIcon,
  },
  { name: "My Classes", link: "/teacher/my-classes", icon: LessonsIcon },
  { name: "My Students", link: "/teacher/my-students", icon: UsersIcon },
  { name: "My Profile", link: "/teacher/profile", icon: UsersIcon },
  { name: "Billings", link: "/teacher/my-billings", icon: BillingIcon },
  { name: "Video call", link: "/video-call", icon: VideoCallIcon },
];

type SidebarProps = {
  items?: MenuItem[];
};

export const Sidebar = ({ items }: SidebarProps) => {
  const { pathname } = useLocation();
  const menuItems = items ?? defaultStudentMenuItems;

  return (
    <aside className="fixed top-0 left-0 flex flex-col w-[218px] h-screen items-center gap-[30px] pt-[30px] pb-0 px-0 bg-[#211c27]">
      <div className="pt-[30px] pb-[30px]">
        <span className="w-[93px] h-[30px] font-rubic font-bold text-[25.2px] leading-[100%] tracking-[-0.14px] text-[#FFFFFF]">
          studyBridge
        </span>
      </div>

      <ul className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive = pathname === item.link;

          return (
            <li
              key={item.name}
              className="flex flex-col h-[60px] items-start justify-center gap-2.5 px-3 py-0 relative self-stretch w-full"
            >
              <Link
                to={item.link}
                className={`
                  group
                  ml-[12px]
                  mr-[12px]
                  w-[194px]
                  h-[50px]
                  pt-[13px]
                  pr-[12px]
                  pb-[13px]
                  pl-[12px]
                  gap-[10px]
                  rounded-[5px]
                  flex items-center transition-colors
                  whitespace-nowrap
                  ${
                    isActive
                      ? "bg-[#F1EEFE] opacity-100 hover:bg-[#E6D9FF]"
                      : "hover:bg-[#2A2433]"
                  }
                `}
              >
                <Icon
                  className={`
                    w-[20px]
                    h-[20.8001708984375px]
                    shrink-0
                    transition-colors
                    ${
                      isActive
                        ? "text-[#7839CD] group-hover:text-[#6B2FC2]"
                        : "text-[#474747] group-hover:text-[#E6D9FF]"
                    }
                  `}
                />

                <span
                  className={`
                    h-[24px]
                    opacity-100
                    font-raleway
                    font-medium
                    text-[16px]
                    leading-[24px]
                    tracking-[0px]
                    transition-colors
                    ${
                      isActive
                        ? "text-[#7839CD] group-hover:text-[#6B2FC2]"
                        : "text-[#474747] group-hover:text-[#E6D9FF]"
                    }
                  `}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
