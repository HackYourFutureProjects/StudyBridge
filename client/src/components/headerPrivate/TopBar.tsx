import { useState } from "react";
import SearchIcon from "../icons/Search";
import HelpIcon from "../icons/QuestionMark";
import { LogoutConfirmation } from "../auth/logoutConfirmation/LogoutConfirmation";
import { ProfileIndicator } from "../profileIndicator/ProfileIndicator.tsx";

export const TopBar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  return (
    <>
      <header
        className="top-0 left-0 md:left-[218px] z-50 fixed flex flex-row
          justify-between items-center bg-[#211c27] px-4 md:px-10
          border-[#0F0E13] border-b w-full md:w-[calc(100%-218px)] h-[70px]"
      >
        <div
          className="flex flex-1 items-center gap-[12px] px-[18px]
            border-[#E4E4E4] border-[1.4px] rounded-[10px] md:w-[350px]
            max-w-[200px] md:max-w-[350px] h-[48px]"
        >
          <SearchIcon className="w-4 h-4 text-[#959595] shrink-0" />

          <input
            type="text"
            placeholder="Global Search"
            className="bg-transparent p-0 border-none outline-none w-full h-full
              placeholder:font-inter placeholder:font-normal text-[#F2F2F2]
              placeholder:text-[#959595] placeholder:text-[16px]
              placeholder:leading-[100%] placeholder:tracking-normal
              caret-[#F2F2F2]"
          />
        </div>
        <div className="flex flex-row items-center gap-4 md:gap-[32px]">
          <button
            aria-label="Help"
            className="text-[#474747] hover:text-[#8A8A8A] transition-colors
              cursor-pointer"
          >
            <HelpIcon className="w-[19.5px] h-[19.5px]" />
          </button>

          {/* Vertical Divider */}
          <div className="bg-[#E4E4E4] w-px h-[33px]" />

          {/* Logout Button */}
          <ProfileIndicator />
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};
