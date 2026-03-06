import { ReactNode, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button/Button";
import { LinkOption } from "../../types/linkOptionsType";

type ControlPanelTypes = {
  classNames?: string;
  options: LinkOption[];
  children: ReactNode;
  openMenu: boolean;
  setOpenMenu: (open: boolean) => void;
};

export const DropdownMenu = ({
  classNames,
  options,
  children,
  openMenu,
  setOpenMenu,
}: ControlPanelTypes) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openMenu) return;

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
      className={twMerge(
        "hidden md:flex relative flex-col items-end",
        classNames,
      )}
    >
      {children}
      <div
        className={[
          "absolute top-[130%] right-0 z-400 flex flex-col items-start rounded-2xl border border-white/10 bg-[#15141D] shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden",
          "min-w-40 w-max",
          "opacity-0 invisible transition-opacity duration-300 ease-in-out",
          openMenu && "opacity-100 visible",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {options.map((option) => {
          const Icon = option.icon;

          const content = (
            <div className="flex items-center gap-2.5 text-light-100">
              {Icon && <Icon className="w-5 h-5 shrink-0" />}
              <span>{option.title}</span>
            </div>
          );

          return option.link ? (
            <Button
              key={option.id}
              as={NavLink}
              className="flex justify-start w-full rounded-none p-2.5 transition-none
                         hover:text-(--color-dark-900) hover:bg-gray-400"
              to={option.link}
              variant="link"
              onClick={() => setOpenMenu(false)}
            >
              {content}
            </Button>
          ) : (
            <Button
              key={option.id}
              className="flex justify-start w-full rounded-none p-2.5 transition-none
                         hover:text-(--color-dark-900) hover:bg-gray-400"
              variant="link"
              onClick={() => {
                option.actionCallback?.();
                setOpenMenu(false);
              }}
            >
              {content}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
