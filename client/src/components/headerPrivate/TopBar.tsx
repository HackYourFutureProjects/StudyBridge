import { useState } from "react";
import SearchIcon from "../icons/Search";
import HelpIcon from "../icons/QuestionMark";
import LogoutIcon from "../icons/LogoutIcon";
import { LogoutConfirmation } from "../auth/logoutConfirmation/LogoutConfirmation";

export const TopBar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  return (
    <>
      <header
        className="fixed top-0 left-0 z-50 w-full h-[70px] px-4 flex flex-row items-center justify-between bg-[#211c27] border-b border-[#0F0E13] 
md:left-[218px] md:w-[calc(100%-218px)] md:px-10"
      >
        <div className="flex-1 max-w-[200px] md:max-w-[350px] md:w-[350px] h-[48px] px-[18px] gap-[12px] rounded-[10px] border-[1.4px] border-[#E4E4E4] flex items-center">
          <SearchIcon className="w-4 h-4 text-[#959595] shrink-0" />

          <input
            type="text"
            placeholder="Global Search"
            className="
                    w-full h-full
                    text-[#F2F2F2] bg-transparent caret-[#F2F2F2]
                    placeholder:font-inter
                    placeholder:font-normal
                    placeholder:text-[16px]
                    placeholder:leading-[100%]
                    placeholder:tracking-normal
                    placeholder:text-[#959595]  
                    outline-none border-none p-0
                    "
          />
        </div>
        <div className="flex flex-row items-center gap-4 md:gap-[32px]">
          <button className="cursor-pointer text-[#474747] hover:text-[#8A8A8A] transition-colors">
            <HelpIcon className="w-[19.5px] h-[19.5px]" />
          </button>

          {/* Vertical Divider */}
          <div className="w-px h-[33px] bg-[#E4E4E4]" />

          {/* Logout Button */}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className=" cursor-pointer flex items-center gap-2 md:gap-5  text-[#474747] hover:text-[#8A8A8A] transition-colors"
          >
            <LogoutIcon className="w-[20px] h-[20px]" />
            <span className=" hidden font-semibold text-[16px] leading-[100%] md:block">
              {/* On smaller screens, Logout word is hiiden */}
              Logout
            </span>
          </button>
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
