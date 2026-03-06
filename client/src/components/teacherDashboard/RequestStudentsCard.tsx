import { useEffect, useState } from "react";

type RequestStudentsCardProps = {
  count: number;
};

export const RequestStudentsCard = ({ count }: RequestStudentsCardProps) => {
  const [animatedCount, setAnimatedCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = count / steps;
    let currentCount = 0;

    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= count) {
        setAnimatedCount(count);
        clearInterval(timer);
      } else {
        setAnimatedCount(Math.floor(currentCount));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <div
      className={`
        relative overflow-hidden
        w-[332px] h-[200px]
        px-[32px] py-[24px]
        flex flex-col items-center justify-center gap-[16px]
        rounded-[20px]
        bg-dark-900 border-2 border-blue-500
        shadow-[0px_20px_60px_0px_rgba(59,130,246,0.15)]
        hover:shadow-[0px_25px_80px_0px_rgba(59,130,246,0.25)]
        hover:bg-dark-700
        transform transition-all duration-500 ease-out
        hover:scale-105 hover:-translate-y-2
        cursor-pointer group
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      <div className="absolute inset-0 rounded-[20px] border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />

      <div className="relative z-10 w-full flex flex-col items-center gap-[20px]">
        <div className="text-[22px] font-bold leading-[100%] tracking-[-0.5px] text-white drop-shadow-sm">
          My Request Students
        </div>

        <div className="relative">
          <span
            className="
              font-bold
              text-[48px]
              leading-[1]
              tracking-[-1px]
              text-white
              text-center
              drop-shadow-lg
              block
              transform transition-all duration-300
              group-hover:scale-110 group-hover:text-blue-100
            "
          >
            {animatedCount}
          </span>
        </div>

        <div className="w-full max-w-[200px] h-1 bg-blue-500/20 rounded-full overflow-hidden border border-blue-500/30">
          <div
            className="h-full bg-gradient-to-r from-blue-500/60 to-blue-400/80 rounded-full transition-all duration-1500 ease-out"
            style={{
              width: count > 0 ? "100%" : "0%",
              transform: `translateX(${count > 0 ? "0%" : "-100%"})`,
            }}
          />
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
};
