import { useState } from "react";
import { DropdownMenu } from "./DropdownMenu";
import { Button } from "../ui/button/Button";
import ArrowDown from "../icons/ArrowDown";
import DefaultAvatarIcon from "../icons/DefaultAvatarIcon";
import { useAuthSessionStore } from "../../store/authSession.store";
import { getAvatarUrl } from "../../api/upload/upload.api";
import type { linkOption } from "../../types/linkOptionsType";

type Props = {
  options: linkOption[];
  variant?: "main" | "private";
};

export const IndicatorTrigger = ({ options, variant = "private" }: Props) => {
  const [openMenu, setOpenMenu] = useState(false);
  const user = useAuthSessionStore((s) => s.user);

  const avatarUrl = getAvatarUrl(user?.profileImageUrl || null);

  const wrapperClass =
    variant === "private" ? "hidden md:flex items-center" : "flex items-center";

  return (
    <div className={wrapperClass}>
      <DropdownMenu
        openMenu={openMenu}
        options={options}
        setOpenMenu={setOpenMenu}
      >
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
      </DropdownMenu>
    </div>
  );
};
