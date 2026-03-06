import React from "react";

type StudentLessonCardProps = {
  lesson: string;
  teacher: string;
  price: string;
  date: string;
  time: string;
  isPast: boolean;
  videoCall: React.ReactNode;
};

export const StudentLessonCard = ({
  lesson,
  teacher,
  price,
  date,
  time,
  isPast,
  videoCall,
}: StudentLessonCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-dark-900/30 border border-blue-500/20 rounded-[16px] p-[20px] hover:border-blue-500/40 transition-all duration-300 hover:bg-dark-900/50">
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-white font-medium text-[16px] mb-[4px]">
              {lesson}
            </h3>
            <p className="text-gray-400 text-[14px]">{teacher}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-400 font-semibold text-[16px]">
              {price} euro
            </p>
            <p className="text-gray-400 text-[12px] mt-[2px]">
              {formatDate(date)} • {time}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-[8px] border-t border-gray-700/30">
          <div className="flex items-center gap-[8px]">
            <div
              className={`w-[8px] h-[8px] rounded-full ${
                isPast ? "bg-gray-500" : "bg-green-500"
              }`}
            />
            <span className="text-[12px] text-gray-400">
              {isPast ? "Past" : "Active"}
            </span>
          </div>

          <div className="flex items-center">{videoCall}</div>
        </div>
      </div>
    </div>
  );
};
