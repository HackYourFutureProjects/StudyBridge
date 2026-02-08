type NumberOfStudentsCardProps = {
  count: number;
};

export const NumberOfStudentsCard = ({ count }: NumberOfStudentsCardProps) => {
  return (
    <div
      className="
    w-[332px] h-[200px]
    px-[81px] py-[32px]
    flex flex-col items-center gap-[24px]
    opacity-100
    rotate-0
    rounded-[12px]
    bg-[#1E1927]
    shadow-[0px_6px_58px_0px_rgba(196,203,214,0.1)]
  "
    >
      <div className="w-full flex flex-col items-center gap-[24px]">
        <div className="text-[25.2px] font-bold leading-[100%] tracking-[-0.14px] text-white">
          My Students
        </div>
        <div className="w-[170px] h-[96px] flex items-center justify-center">
          <span
            className="
          font-bold
          text-[60px]
          leading-[96px]
          tracking-[-0.14px]
          text-white
          text-center
          opacity-100
        "
          >
            {count}
          </span>
        </div>
      </div>
    </div>
  );
};
