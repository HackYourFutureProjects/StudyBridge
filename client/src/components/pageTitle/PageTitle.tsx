type PageTitleProps = {
  title: string;
};

export const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <div>
      <div className="w-full mt-0">
        <div className="h-[85px] w-full p-[0px] flex flex-col">
          <div className="h-[85px] w-full opacity-100 pl-[24px] pr-[24px] pt-[8px] pb-[8px] border-b border-[#E4E4E4] flex flex-row flex-nowrap justify-start items-start relative">
            <div
              className="
            bg-[linear-gradient(90deg,#7186FF_11%,#FE7587_100%),linear-gradient(0deg,rgba(0,0,0,0),rgba(0,0,0,0))]
            bg-clip-text text-transparent
            font-raleway font-bold
            text-[48px] leading-[76px] tracking-[0px]
            w-[395px] h-[76px]
            opacity-100
            flex items-center
          "
            >
              {title}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
