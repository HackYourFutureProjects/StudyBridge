import React, { useState } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { Button } from "../ui/button/Button";
import ArrowDown from "../icons/ArrowDown";
import DefaultAvatarIcon from "../icons/DefaultAvatarIcon";
import { useAuthSessionStore } from "../../store/authSession.store";
import { getAvatarUrl } from "../../api/upload/upload.api";
import type { LinkOption } from "../../types/linkOptionsType";
import Bell from "../icons/Bell.tsx";
import { useNotificationFeedStore } from "../../store/notificationFeed.store.ts";
import { DropdownNotificationsMenu } from "../DropdownNotificationsMenu/DropdownNotificationsMenu.tsx";
import { twMerge } from "tailwind-merge";

type Props = {
  options: LinkOption[];
  variant?: "main" | "private";
};

export const IndicatorTrigger = ({ options, variant = "private" }: Props) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotificationMenu, setOpenNotificationMenu] = useState(false);
  const user = useAuthSessionStore((s) => s.user);
  const notifications = useNotificationFeedStore((s) => s.items);
  const avatarUrl = getAvatarUrl(user?.profileImageUrl || null);

  const wrapperClass =
    variant === "private" ? "hidden md:flex items-center" : "flex items-center";
  const unreadNotifications = useNotificationFeedStore(
    (s) => s.items.filter((item) => !item.isRead).length,
  );
  return (
    <div className={twMerge("flex gap-5", wrapperClass)}>
      <div className="relative">
        <Button
          variant="link"
          className="relative"
          onClick={() => setOpenNotificationMenu((prev) => !prev)}
        >
          <div
            className="absolute right-2 top-1 flex items-center justify-center
          text-[12px] min-w-4 min-h-4 bg-danger-100 rounded-full text-light-100"
          >
            {unreadNotifications}
          </div>
          <Bell />
        </Button>
        <DropdownNotificationsMenu
          setOpenMenu={setOpenNotificationMenu}
          openMenu={openNotificationMenu}
          options={notifications}
          currentRole={user?.role}
        />
      </div>
      <div className="bg-[#E4E4E4] w-px h-8.25" />
      <DropdownMenu
        openMenu={openMenu}
        options={options}
        setOpenMenu={setOpenMenu}
      >
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="link"
            className="flex items-center gap-2.5 text-light-300 hover:text-light-100 transition-colors"
            onClick={() => setOpenMenu((prev) => !prev)}
            aria-expanded={openMenu}
            aria-haspopup="menu"
          >
            <span className="w-9.5 h-9.5 rounded-full overflow-hidden">
              {avatarUrl ? (
                <img
                  className="w-full h-full object-cover"
                  src={avatarUrl}
                  alt="userPhoto"
                />
              ) : (
                <DefaultAvatarIcon className="w-full h-full" />
              )}
            </span>

            <span className="hidden md:block">
              {user?.firstName ? user.firstName : user?.email}
            </span>

            <ArrowDown />
          </Button>
        </div>
      </DropdownMenu>
    </div>
  );
};
