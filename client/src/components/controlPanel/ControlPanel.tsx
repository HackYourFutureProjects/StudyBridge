import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button/Button";
import ArrowDown from "../icons/ArrowDown";
import { authRoutesVariables } from "../../router/routesVariables/pathVariables.ts";

type ControlPanelTypes = {
  classNames?: string;
};

export const ControlPanel = ({ classNames }: ControlPanelTypes) => {
  const [openMenu, setOpenMenu] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

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
      className={twMerge(
        "hidden md:flex relative flex-col items-end",
        classNames,
      )}
    >
      <Button
        variant="secondary"
        className="items-center gap-[10px]"
        onClick={() => setOpenMenu((prev) => !prev)}
      >
        <span className="text-light-100">Sign in </span>
        <ArrowDown />
      </Button>
      <div
        className={[
          "absolute top-[130%] z-[400] flex items-start w-full flex-col rounded-[20px] bg-[var(--color-dark-900)] p-[10px]",
          "opacity-0 invisible transition-opacity duration-300 ease-in-out",
          openMenu && "opacity-100 visible",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Button
          as={NavLink}
          className="flex justify-start gap-[10px] w-full rounded-[40px] p-[10px] transition-none
                        hover:text-[var(--color-dark-900)] hover:bg-[var(--color-purple-500)]
                        "
          to={authRoutesVariables.loginStudent}
          variant="link"
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          <span className="text-light-100">Sign in as a student</span>
        </Button>
        <Button
          as={NavLink}
          className="flex justify-start gap-[10px]  w-full rounded-[40px] p-[10px] transition-none
                                hover:text-[var(--color-dark-900)] hover:bg-[var(--color-purple-500)]
                               "
          to={authRoutesVariables.loginTutor}
          variant="link"
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          <span className="text-light-100">Sign in as a tutor</span>
        </Button>
      </div>
    </div>
  );
};
