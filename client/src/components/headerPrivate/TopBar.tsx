import React, { useState } from "react";
import { LogoutConfirmation } from "../auth/logoutConfirmation/LogoutConfirmation";
import { ProfileIndicator } from "../profileIndicator/ProfileIndicator.tsx";
import { Logo } from "../logo/Logo.tsx";
import { NotificationBar } from "../notificationBar/NotificationBar.tsx";
import { useNotificationFeedStore } from "../../store/notificationFeed.store.ts";
import { lockScroll } from "../../util/modalScroll.util.ts";
import { useAuthSessionStore } from "../../store/authSession.store.ts";

export const TopBar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const notifications = useNotificationFeedStore((s) => s.items);
  const [openNotificationMenu, setOpenNotificationMenu] = useState(false);
  const unreadNotifications = useNotificationFeedStore(
    (s) => s.items.filter((item) => !item.isRead).length,
  );
  const user = useAuthSessionStore((s) => s.user);

  const onOpenNotificationsMenu = () => {
    setOpenNotificationMenu(!openNotificationMenu);
    lockScroll();
  };
  return (
    <>
      <header className="h-(--header-height) w-full bg-[#15141D]">
        <div className="mx-auto h-full max-w-360 px-4 md:px-8">
          <div className="flex justify-center items-center md:justify-between h-full">
            <div className="flex items-center gap-10">
              <div className="flex items-center justify-between gap-4 min-w-0">
                {/* Search */}
                <Logo className="md:hidden" />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 md:gap-8 shrink-0">
              <NotificationBar
                options={notifications}
                openMenu={openNotificationMenu}
                onOpenNotificationsMenu={onOpenNotificationsMenu}
                unreadNotifications={unreadNotifications}
                setOpenNotificationMenu={setOpenNotificationMenu}
                currentRole={user?.role}
              />
              <div className="bg-[#E4E4E4] w-px h-8.25" />
              <ProfileIndicator />
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};
