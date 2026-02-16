import LogoutIcon from "../icons/LogoutIcon.tsx";
import HelpIcon from "../icons/QuestionMark.tsx";
import { Button } from "../ui/button/Button.tsx";
import { useModalStore } from "../../store/modals.store.ts";

export const ProfileIndicator = () => {
  const { open } = useModalStore();

  return (
    <>
      <div className="flex flex-row items-center gap-4 md:gap-8">
        <button
          aria-label="Help"
          className="text-[#474747] hover:text-[#8A8A8A] transition-colors
              cursor-pointer"
        >
          <HelpIcon className="w-[19.5px] h-[19.5px]" />
        </button>

        {/* Vertical Divider */}
        <div className="bg-[#E4E4E4] w-px h-8.25" />
        <Button
          variant="link"
          onClick={() => open("signup")}
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
