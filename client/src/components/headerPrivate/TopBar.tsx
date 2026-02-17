import React, { useState } from "react";
import SearchIcon from "../icons/Search";
import HelpIcon from "../icons/QuestionMark";
import { LogoutConfirmation } from "../auth/logoutConfirmation/LogoutConfirmation";
import { ProfileIndicator } from "../profileIndicator/ProfileIndicator.tsx";
import { Logo } from "../logo/Logo.tsx";

export const TopBar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  return (
    <>
      <header className="fixed top-0 left-0 z-50 h-[var(--header-height)] w-full bg-[#211c27] border-b border-[#0F0E13]">
        <div className="mx-auto h-full max-w-[1440px] px-4 md:px-8">
          <div className="grid h-full grid-cols-1 md:grid-cols-[var(--sidebar-width)_1fr] items-center">
            <div className="hidden md:flex items-center">
              <Logo />
            </div>

            <div className="flex items-center justify-between gap-4 min-w-0">
              {/* Search */}
              <div
                className="flex items-center gap-3 px-4 h-[48px]
              border border-[#E4E4E4] rounded-[10px]
              w-full max-w-[200px] md:max-w-[350px] min-w-0"
              >
                <SearchIcon className="w-4 h-4 text-[#959595] shrink-0" />
                <input
                  type="text"
                  placeholder="Global Search"
                  className="bg-transparent p-0 border-none outline-none w-full h-full
                text-[#F2F2F2] placeholder:text-[#959595]"
                />
              </div>

              <div className="flex items-center gap-4 md:gap-8 shrink-0">
                <button
                  aria-label="Help"
                  className="text-[#474747] hover:text-[#8A8A8A] transition-colors cursor-pointer"
                >
                  <HelpIcon className="w-[19.5px] h-[19.5px]" />
                </button>
                <div className="bg-[#E4E4E4] w-px h-[33px]" />
                <ProfileIndicator />
              </div>
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
