type StatusStyles = {
  bgStatus: string;
  text: string;
  label: string;
};

type AppointmentStatusBarProps = {
  date: string;
  time: string;
  statusStyles: StatusStyles;
};

export const AppointmentStatusBar = ({
  date,
  time,
  statusStyles,
}: AppointmentStatusBarProps) => {
  return (
    <div
      className={`w-full px-4 md:px-6 py-2 md:py-3 flex items-center justify-between ${statusStyles.bgStatus}`}
    >
      <span
        className={`text-[12px] md:text-[14px] font-medium ${statusStyles.text}`}
      >
        {statusStyles.label}
      </span>
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
