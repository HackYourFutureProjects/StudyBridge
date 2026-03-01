type StatusStyles = {
  bgStatus: string;
  text: string;
  label: string;
};

type AppointmentStatusBarProps = {
  date: string;
  time: string;
  statusStyles: StatusStyles;
  isRegularStudent?: boolean;
  isRegularTeacher?: boolean;
  onShowSchedule?: () => void;
};

export const AppointmentStatusBar = ({
  date,
  time,
  statusStyles,
  isRegularStudent = false,
  isRegularTeacher = false,
  onShowSchedule,
}: AppointmentStatusBarProps) => {
  if (isRegularTeacher) {
    return (
      <div className="w-full px-4 md:px-6 py-2 md:py-3 flex items-center justify-between bg-purple-900/30">
        <span className="text-[12px] md:text-[14px] font-medium text-purple-300">
          Regular Teacher
        </span>
        {onShowSchedule && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShowSchedule();
            }}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white/20 hover:bg-white/30 text-white border border-white/30"
          >
            Show Schedule
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full px-4 md:px-6 py-2 md:py-3 flex items-center justify-between ${statusStyles.bgStatus}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`text-[12px] md:text-[14px] font-medium ${statusStyles.text}`}
        >
          {statusStyles.label}
        </span>
        {isRegularStudent && (
          <span className="text-[10px] md:text-[12px] px-2 py-1 bg-purple-600 text-white rounded-full font-medium">
            Regular
          </span>
        )}
      </div>
      <div className="text-right">
        <div
          className={`text-[12px] md:text-[14px] font-medium ${statusStyles.text}`}
        >
          {date}
        </div>
        <div className={`text-[12px] md:text-[14px] ${statusStyles.text}`}>
          {time}
        </div>
      </div>
    </div>
  );
};
