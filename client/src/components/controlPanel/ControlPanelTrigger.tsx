import { DropdownMenu } from "./DropdownMenu.tsx";
import { Button } from "../ui/button/Button.tsx";
import ArrowDown from "../icons/ArrowDown.tsx";
import { useState } from "react";
import { linkOption } from "../../types/linkOptionsType.ts";

type ControlPanelZTypes = {
  options: linkOption[];
};

export const ControlPanelTrigger = ({ options }: ControlPanelZTypes) => {
  const [openMenu, setOpenMenu] = useState(false);
  const onSetOpenMenu = (open: boolean) => {
    setOpenMenu(open);
  };
  return (
    <DropdownMenu
      openMenu={openMenu}
      options={options}
      setOpenMenu={onSetOpenMenu}
    >
      <Button
        variant="secondary"
        className="items-center gap-2.5"
        onClick={() => setOpenMenu((prev) => !prev)}
      >
        <span className="text-light-100">Sign in </span>
        <ArrowDown />
      </Button>
    </DropdownMenu>
  );
};
