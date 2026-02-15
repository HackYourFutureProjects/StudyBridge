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
  { name: "Billings", link: "/teacher/my-billings", icon: BillingIcon },
  { name: "Video call", link: "/video-call", icon: VideoCallIcon },
  { name: "Settings", link: "/settings", icon: SettingsIcon },
];

type SidebarProps = {
  items?: MenuItem[];
};

export const Sidebar = ({ items }: SidebarProps) => {
  const { pathname } = useLocation();
  const menuItems = items ?? defaultStudentMenuItems;

  return (
    <aside
      /*Now there is 2 Views: Mobile View (Bottom Navigation Bsr) which is base, and md: which is for larger screens  */

      className="fixed  bottom-0 left-0 z-50 w-full h-[70px] flex  flex-row items-center bg-[#211c27]
      md:top-0 md:bottom-auto md:h-screen md:w-[218px] md:flex-col md:pt-[30px] md:gap-[30px] 
       transition-all duration-300"
    >
      <div className="hidden md:flex pt-[30px] pb-[30px] px-6">
        <span className=" font-bold text-[24px] text-white">studyBridge</span>
      </div>

      <ul
        className="
        flex flex-row md:flex-col 
        w-full h-full md:h-auto
        items-center md:items-start 
        justify-around md:justify-start
      "
      >
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive = pathname === item.link;

          return (
            <li key={item.name} className="flex-1 md:w-full md:px-3">
              <Link
                to={item.link}
                className={`
                  flex flex-col md:flex-row items-center 
                  gap-1 md:gap-[10px] 
                  py-2 md:py-[13px] md:px-[12px]
                  rounded-[5px] transition-all
                  ${isActive ? "bg-[#F1EEFE] text-[#7839CD]" : "text-[#474747] md:text-gray-400 hover:bg-[#2A2433]"}
                `}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${isActive ? "text-[#7839CD]" : "text-current"}`}
                />

                <span
                  className={`
                  font-raleway font-medium 
                  text-[10px] md:text-[16px] 
                  leading-tight md:leading-[24px]
                  ${isActive ? "text-[#7839CD]" : "text-current"}
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
