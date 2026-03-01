import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/sidebar/Sidebar.tsx";
import {
  defaultStudentMenuItems,
  defaultTeacherMenuItems,
} from "../components/sidebar/sidebarMenuItems.ts";
import { TopBar } from "../components/headerPrivate/TopBar.tsx";
import { useAuthSessionStore } from "../store/authSession.store.ts";
import { useEffect } from "react";
import { useSocketStore } from "../store/socket.store.ts";
import { usePresenceSubscribe } from "../hooks/usePresenceSubscribe.ts";

export const PrivateLayout = () => {
  const user = useAuthSessionStore((s) => s.user);
  const accessToken = useAuthSessionStore((s) => s.accessToken);
  const connect = useSocketStore((s) => s.connect);
  const disconnect = useSocketStore((s) => s.disconnect);
  const items =
    user?.role === "teacher"
      ? defaultTeacherMenuItems
      : defaultStudentMenuItems;

  usePresenceSubscribe();

  useEffect(() => {
    if (!accessToken) {
      disconnect();
      return;
    }
    connect(accessToken);
    return () => disconnect();
  }, [accessToken, connect, disconnect]);

  return (
    <>
      <div className="mx-auto max-w-360 grid grid-cols-1 md:grid-cols-[218px_1fr]">
        <div className="hidden md:block">
          <div className="sticky top-0 h-dvh">
            <Sidebar items={items} variant="desktop" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="sticky top-0 z-50">
            <TopBar />
          </div>

          <main className="w-full bg-[#15141D] pb-18.5 md:pb-0 min-h-[calc(100vh-var(--header-height))]">
            <Outlet />
          </main>
        </div>
      </div>

      <div className="md:hidden">
        <Sidebar items={items} variant="mobile" />
      </div>
    </>
  );
};
