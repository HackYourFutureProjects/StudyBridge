import SearchIcon from "../icons/Search";
import HelpIcon from "../icons/QuestionMark";

export const TopBar = () => {
  return (
    <>
      <header className="fixed z-50 w-[1140px] h-[80px] top-[15px] left-[252px] pt-[16px] pr-[24px] pb-[16px] pl-[24px] gap-[32px] border-b border-[#0F0E13] flex flex-row items-center">
        <div className="w-[350px] h-[48px] pt-[12px] pr-[18px] pb-[12px] pl-[18px] gap-[12px] rounded-[10px] border-[1.4px] border-[#E4E4E4] flex items-center">
          <SearchIcon className="w-4 h-4 text-[#959595]" />

          <input
            type="text"
            placeholder="Global Search"
            className="
                    w-[278px] h-[19px]
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

        <div className="h-[38px] w-[710px] p-0 flex flex-row justify-end items-center gap-[32px] relative">
          <button className="text-[#474747] hover:text-[#8A8A8A] transition-colors">
            <HelpIcon className="w-[19.5px] h-[19.5px]" />
          </button>
        </div>
      </header>
    </>
  );
};
