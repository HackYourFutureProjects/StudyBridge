import React, { useState } from "react";
import HelpIcon from "../icons/QuestionMark";
import { LogoutConfirmation } from "../auth/logoutConfirmation/LogoutConfirmation";
import { ProfileIndicator } from "../profileIndicator/ProfileIndicator.tsx";
import { Logo } from "../logo/Logo.tsx";

export const TopBar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  return (
    <>
      <header className="h-(--header-height) w-full bg-[#15141D]">
        <div className="mx-auto h-full max-w-360 px-4 md:px-8">
          <div className="flex justify-center items-center md:justify-between h-full">
            <div className="flex items-center gap-10">
              <div className="flex items-center justify-between gap-4 min-w-0">
                {/* Search */}
                <Logo className="md:hidden" />
                {/*<div*/}
                {/*  className="flex items-center gap-3 px-4 h-[48px]*/}
                {/*    border border-[#E4E4E4] rounded-[10px]*/}
                {/*    w-full max-w-[200px] md:max-w-[350px] min-w-0"*/}
                {/*>*/}
                {/*  <SearchIcon className="w-4 h-4 text-[#959595] shrink-0" />*/}
                {/*  <input*/}
                {/*    type="text"*/}
                {/*    placeholder="Global Search"*/}
                {/*    className="bg-transparent p-0 border-none outline-none w-full h-full*/}
                {/*text-[#F2F2F2] placeholder:text-[#959595]"*/}
                {/*  />*/}
                {/*</div>*/}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 md:gap-8 shrink-0">
              <button
                aria-label="Help"
                className="text-[#474747] hover:text-[#8A8A8A] transition-colors cursor-pointer"
              >
                <HelpIcon className="w-[19.5px] h-[19.5px]" />
              </button>
              <div className="bg-[#E4E4E4] w-px h-8.25" />
              <ProfileIndicator />
            </div>
          </div>
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
