import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button/Button";
import { AppNotification } from "../../store/notificationFeed.store.ts";
import {
  chatRoutes,
  studentBase,
  studentPrivatesRoutesVariables,
  teacherBase,
  teacherPrivatesRoutesVariables,
} from "../../router/routesVariables/pathVariables.ts";
import { Badge } from "../ui/badge/Badge.tsx";
import { useMarkOneNotificationAsRead } from "../../features/notifications/mutation/useMarkOneNotificationAsRead.tsx";
import { useDeleteAllReadNotifications } from "../../features/notifications/mutation/useDeleteAllReadNotifications.ts";
import { unlockScroll } from "../../util/modalScroll.util.ts";
import { AnimatePresence, motion } from "framer-motion";
type ControlPanelTypes = {
  classNames?: string;
  options: AppNotification[];
  openMenu: boolean;
  setOpenMenu: (open: boolean) => void;
  currentRole?: "student" | "teacher" | "moderator";
};

export const DropdownNotificationsMenu = ({
  classNames,
  options,
  openMenu,
  setOpenMenu,
  currentRole,
}: ControlPanelTypes) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { mutateAsync: markOneAsRead } = useMarkOneNotificationAsRead();
  const { mutateAsync: clearReadNotifications, isPending } =
    useDeleteAllReadNotifications();

  const hasReadNotifications = options.some((item) => item.isRead);
  const getNotificationLink = (option: AppNotification) => {
    if (option.type === "chatMessages") {
      return currentRole === "student"
        ? `${studentBase}/${chatRoutes.root}/${option.conversationId}`
        : `${teacherBase}/${chatRoutes.root}/${option.conversationId}`;
    }

    return currentRole === "student"
      ? `${studentBase}/${studentPrivatesRoutesVariables.appointments}`
      : `${teacherBase}/${teacherPrivatesRoutesVariables.appointments}`;
  };

  const onCloseNotificationsMenu = () => {
    unlockScroll();
    setOpenMenu(false);
  };

  const getNotificationItemClassName = (option: AppNotification) => {
    if (option.isRead) {
      return "bg-zinc-500/10 hover:bg-zinc-500/15";
    }

    if (option.type === "chatMessages") {
      return "bg-blue-500/10 hover:bg-blue-500/15";
    }

    if (option.status === "approved") {
      return "bg-green-500/10 hover:bg-green-500/15";
    }

    return "bg-red-500/10 hover:bg-red-500/15";
  };

  useEffect(() => {
    if (!openMenu) {
      return;
    }

    const onPointerDown = (e: PointerEvent) => {
      const el = wrapperRef.current;
      if (!el) {
        return;
      }
      if (!el.contains(e.target as Node)) {
        onCloseNotificationsMenu();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openMenu]);

  return (
    <div
      ref={wrapperRef}
      className={twMerge(
        "absolute right-0 top-[130%] z-400",
        openMenu ? "pointer-events-auto" : "pointer-events-none",
        classNames,
      )}
    >
      <div
        className={twMerge(
          "w-90 overflow-hidden rounded-2xl border border-gray-500 bg-[#15141D] shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
          "transition-all duration-200 ease-in-out",
          openMenu
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0 pointer-events-none",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <span className="text-sm font-medium text-light-100">
            Notifications
          </span>

          {hasReadNotifications && (
            <Button
              variant="link"
              type="button"
              onClick={async () => {
                await clearReadNotifications();
              }}
              disabled={isPending}
              className="text-xs text-light-100 hover:text-light-100 disabled:opacity-50"
            >
              Clear read
            </Button>
          )}
        </div>
        <div className="scrollbar-thin max-h-105 overflow-y-auto">
          {options.length === 0 ? (
            <div className="p-4 text-sm text-light-500">
              No notifications yet
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {options.map((option) => (
                <motion.div
                  key={option.id}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 80 }}
                  transition={{ duration: 0.2 }}
                >
                  {option.type === "chatMessages" ? (
                    <Button
                      as={NavLink}
                      variant="link"
                      to={getNotificationLink(option)}
                      onClick={async () => {
                        if (!option.isRead) {
                          await markOneAsRead(option.id);
                        }
                        onCloseNotificationsMenu();
                      }}
                      className={twMerge(
                        "flex w-full justify-start rounded-none border-b border-white/10 p-3 text-left",
                        getNotificationItemClassName(option),
                      )}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1 text-sm font-medium text-light-100">
                          <span>{option.sender.name}</span>
                          <Badge title="Messages" />
                        </div>
                        <span className="line-clamp-1 text-sm text-light-400">
                          {option.message.text}
                        </span>
                      </div>
                    </Button>
                  ) : (
                    <Button
                      as={NavLink}
                      variant="link"
                      to={getNotificationLink(option)}
                      onClick={async () => {
                        if (!option.isRead) {
                          await markOneAsRead(option.id);
                        }
                        onCloseNotificationsMenu();
                      }}
                      className={twMerge(
                        "flex w-full justify-start rounded-none border-b border-white/10 p-3 text-left",
                        getNotificationItemClassName(option),
                      )}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1 text-sm font-medium text-light-100">
                          <span>{option.actor.name}</span>
                          <Badge title="Appointments" />
                        </div>
                        <span className="text-sm text-light-400">
                          {option.status === "approved"
                            ? "Approved your appointment"
                            : "Rejected your appointment"}
                        </span>
                        <span className="text-xs text-light-500">
                          {option.lesson} • {option.date} • {option.time}
                        </span>
                      </div>
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};
