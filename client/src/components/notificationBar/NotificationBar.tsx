import { Button } from "../ui/button/Button.tsx";
import Bell from "../icons/Bell.tsx";
import { DropdownNotificationsMenu } from "../DropdownNotificationsMenu/DropdownNotificationsMenu.tsx";
import React, { Dispatch, SetStateAction } from "react";
import { AppNotification } from "../../store/notificationFeed.store.ts";

type NotificationBarProps = {
  onOpenNotificationsMenu: () => void;
  unreadNotifications: number;
  options: AppNotification[];
  openMenu: boolean;
  currentRole?: "student" | "teacher" | "moderator";
  setOpenNotificationMenu: Dispatch<SetStateAction<boolean>>;
};

export const NotificationBar = ({
  onOpenNotificationsMenu,
  unreadNotifications,
  setOpenNotificationMenu,
  options,
  openMenu,
  currentRole,
}: NotificationBarProps) => {
  return (
    <div className="relative">
      <Button
        variant="link"
        className="relative"
        onClick={onOpenNotificationsMenu}
        aria-label="Notifications"
        aria-expanded={openMenu}
        aria-haspopup="menu"
      >
        {unreadNotifications > 0 && (
          <div
            className="absolute right-2 top-1 flex items-center justify-center
    text-[12px] min-w-4 min-h-4 bg-danger-100 rounded-full text-light-100"
          >
            {unreadNotifications}
          </div>
        )}
        <Bell />
      </Button>
      <DropdownNotificationsMenu
        setOpenMenu={setOpenNotificationMenu}
        openMenu={openMenu}
        options={options}
        currentRole={currentRole}
      />
    </div>
  );
};
