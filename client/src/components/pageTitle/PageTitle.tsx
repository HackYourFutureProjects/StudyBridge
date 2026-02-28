type PageTitleProps = {
  title: string;
};

export const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <div>
      <div className="w-full mt-0">
        <div className="h-[60px] md:h-[70px] lg:h-[85px] w-full p-0 flex flex-col">
          <div className="h-[60px] md:h-[70px] lg:h-[85px] w-full opacity-100 px-4 md:px-6 py-2 md:py-[8px] border-b border-[#E4E4E4] flex flex-row flex-nowrap justify-start items-center relative">
            <div
              className="
            bg-[linear-gradient(90deg,#7186FF_11%,#FE7587_100%),linear-gradient(0deg,rgba(0,0,0,0),rgba(0,0,0,0))]
            bg-clip-text text-transparent
            font-raleway font-bold
            text-[28px] md:text-[36px] lg:text-[48px] 
            leading-[40px] md:leading-[56px] lg:leading-[76px] 
            tracking-[0px]
            opacity-100
            flex items-center
            whitespace-nowrap
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
