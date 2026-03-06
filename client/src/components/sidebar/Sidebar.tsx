import { Link, useLocation } from "react-router-dom";
import { Logo } from "../logo/Logo.tsx";
import { type MenuItem, defaultStudentMenuItems } from "./sidebarMenuItems.ts";

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
          <ul className="flex items-center justify-center h-full gap-2.5 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.link;

              return (
                <li key={item.name} className="flex-1">
                  <Link
                    to={item.link}
                    className={`flex flex-col items-center justify-center gap-1 h-full transition-all rounded-full p-2
                      ${isActive ? "bg-[#F1EEFE] text-[#7839CD]" : "text-[#A2A2A2] hover:bg-[#2A2433]"}
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
    <aside className="w-54.5 h-full">
      <div className="flex items-center justify-center py-7.5 pr-1">
        <Logo />
      </div>
      <ul className="flex flex-col gap-2.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.link;

          return (
            <li key={item.name} className="px-3">
              <Link
                to={item.link}
                className={`flex items-center gap-2.5 py-3.25 px-3 rounded-[5px] transition-all
                  ${isActive ? "bg-[#F1EEFE] text-[#7839CD]" : "text-[#A2A2A2] hover:bg-[#2A2433]"}
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
