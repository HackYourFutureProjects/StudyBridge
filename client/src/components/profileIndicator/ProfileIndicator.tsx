import LogoutIcon from "../icons/LogoutIcon.tsx";
import { Button } from "../ui/button/Button.tsx";
import { useModalStore } from "../../store/modals.store.ts";
import imageNotFound from "../../assets/images/image-not-found.png";
import { NavLink } from "react-router-dom";
import { useAuthSessionStore } from "../../store/authSession.store.ts";

type ProfileIndicatorVariant = "main" | "private";

type Props = {
  variant?: ProfileIndicatorVariant;
};

export const ProfileIndicator = ({ variant = "private" }: Props) => {
  const { open } = useModalStore();
  const user = useAuthSessionStore((s) => s.user);

  const wrapperClass =
    variant === "private"
      ? "hidden md:flex flex-row items-center gap-2 md:gap-3"
      : "flex flex-row items-center gap-2 md:gap-3";
  return (
    <>
      <div className={wrapperClass}>
        <Button
          as={NavLink}
          to="/app"
          className="flex gap-3 text-light-300
              hover:text-light-100 transition-colors cursor-pointer"
          variant="link"
        >
          <div className="w-9.5 h-9.5 rounded-full overflow-hidden">
            <img
              className="w-full h-full"
              src={user?.profileImageUrl ? user.profileImageUrl : imageNotFound}
              alt="userPhoto"
            />
          </div>
          <div>{user?.firstName ? user.firstName : user?.email}</div>
        </Button>

        <Button
          variant="link"
          onClick={() => open("logout")}
          className="flex items-center gap-2 md:gap-5 text-[#474747]
              hover:text-[#8A8A8A] transition-colors cursor-pointer"
        >
          <LogoutIcon className="w-5 h-5" />
          <span
            className="hidden md:block font-semibold text-[16px]
                leading-[100%]"
          >
            {/* On smaller screens, Logout word is hidden */}
            Logout
          </span>
        </Button>
      </div>
    </>
  );
};
