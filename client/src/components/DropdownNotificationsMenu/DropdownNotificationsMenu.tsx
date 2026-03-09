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

  const getNotificationItemClassName = (option: AppNotification) => {
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
        setOpenMenu(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openMenu]);

  return (
    <div
      ref={wrapperRef}
      className={twMerge("absolute right-0 top-[130%] z-400", classNames)}
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
        <div className="max-h-105 overflow-y-auto">
          {options.length === 0 ? (
            <div className="p-4 text-sm text-light-500">
              No notifications yet
            </div>
          ) : (
            options.map((option) =>
              option.type === "chatMessages" ? (
                <Button
                  key={option.id}
                  as={NavLink}
                  variant="link"
                  to={getNotificationLink(option)}
                  onClick={() => setOpenMenu(false)}
                  className={twMerge(
                    "flex w-full justify-start rounded-none border-b border-white/10 p-3 text-left",
                    getNotificationItemClassName(option),
                  )}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium text-light-100">
                      <div className="flex items-center justify-center gap-1">
                        {option.sender.name}
                        <span>
                          <Badge title="Messages" />
                        </span>
                      </div>
                    </span>
                    <span className="line-clamp-1 text-sm text-light-400">
                      {option.message.text}
                    </span>
                  </div>
                </Button>
              ) : (
                <Button
                  key={option.id}
                  as={NavLink}
                  variant="link"
                  to={getNotificationLink(option)}
                  onClick={() => setOpenMenu(false)}
                  className={twMerge(
                    "flex w-full justify-start rounded-none border-b border-white/10 p-3 text-left",
                    getNotificationItemClassName(option),
                  )}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium text-light-100">
                      <div className="flex items-center justify-center gap-1">
                        {option.actor.name}
                        <span>
                          <Badge title="Appointments" />
                        </span>
                      </div>
                    </span>
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
              ),
            )
          )}
        </div>
      </div>
    </div>
  );
};
