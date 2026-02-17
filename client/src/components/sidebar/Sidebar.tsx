import React from "react";
import { Link, useLocation } from "react-router-dom";

import BillingIcon from "../icons/Billing";
import AppointmentsIcon from "../icons/Appointments";
import DashboardIcon from "../icons/Dashboard";
import LessonsIcon from "../icons/Lessons";
import SettingsIcon from "../icons/Settings";
import VideoCallIcon from "../icons/VideoCall";
import UsersIcon from "../icons/UsersIcon";
import { Logo } from "../logo/Logo.tsx";

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
    <>
      {/* 
 New Updated Responsive Sidebar:
  - On mobile, it is fixed at the bottom as a horizontal bar.
  - On larger screens, it becomes a vertical sidebar on the left.
*/}

      <aside
        className="md:top-0 bottom-0 md:bottom-auto left-0 z-50 fixed flex
          flex-row md:flex-col items-center md:gap-[30px] bg-[#211c27]
          md:pt-[30px] w-full md:w-[218px] h-[70px] md:h-screen transition-all
          duration-300"
      >
        <div className="hidden md:flex px-6 pt-[30px] pb-[30px]">
          <Logo />
        </div>

        <ul
          className="flex flex-row md:flex-col justify-around md:justify-start
            items-center md:items-start w-full h-full md:h-auto"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive = pathname === item.link;

            return (
              <li key={item.name} className="flex-1 md:px-3 md:w-full">
                <Link
                  to={item.link}
                  className={` flex flex-col md:flex-row items-center gap-1
                  md:gap-[10px] py-2 md:py-[13px] md:px-[12px] rounded-[5px]
                  transition-all
                  ${isActive ? "bg-[#F1EEFE] text-[#7839CD]" : "text-[#474747] hover:bg-[#2A2433]"}
                  `}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0
                    ${isActive ? "text-[#7839CD]" : "text-current"}`}
                  />

                  <span
                    className={` font-raleway font-medium text-[12px]
                    md:text-[16px] leading-tight md:leading-[24px]
                    ${isActive ? "text-[#7839CD]" : "text-current"} `}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};
