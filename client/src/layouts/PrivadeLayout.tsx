import { Outlet } from "react-router-dom";
import {
  defaultStudentMenuItems,
  defaultTeacherMenuItems,
  Sidebar,
} from "../components/sidebar/Sidebar.tsx";
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
      return;
    }
    if (accessToken) {
      connect(accessToken);
    }
    return () => disconnect();
  }, [accessToken, connect, disconnect]);

  return (
    <>
      <TopBar />

      <div className="mx-auto max-w-360 pt-(--header-height)">
        <div className="grid grid-cols-1 md:grid-cols-[218px_1fr]">
          <div className="hidden md:block sticky top-(--header-height) self-start h-[calc(100dvh-var(--header-height))]">
            <Sidebar items={items} variant="desktop" />
          </div>

          <main className="min-w-0 bg-[#15141D] pb-17.5 md:pb-0">
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
