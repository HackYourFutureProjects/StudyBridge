type StatusStyles = {
  bgStatus: string;
  text: string;
  label: string;
};

type TeacherAppointmentStatusBarProps = {
  date: string;
  time: string;
  statusStyles: StatusStyles;
  showScheduleButton?: boolean;
  onScheduleClick?: () => void;
};

export const TeacherAppointmentStatusBar = ({
  date,
  time,
  statusStyles,
  showScheduleButton = false,
  onScheduleClick,
}: TeacherAppointmentStatusBarProps) => {
  return (
    <div
      className={`w-full px-4 md:px-6 py-2 md:py-3 flex items-center justify-between ${statusStyles.bgStatus}`}
    >
      <span
        className={`text-[12px] md:text-[14px] font-medium ${statusStyles.text}`}
      >
        {statusStyles.label}
      </span>
      {showScheduleButton ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onScheduleClick?.();
          }}
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors bg-white/20 hover:bg-white/30 ${statusStyles.text} border border-white/30`}
        >
          Choose schedule
        </button>
      ) : (
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
      )}
    </div>
  );
};
