type AppointmentInfoProps = {
  lesson?: string;
  teacherName?: string;
  price: string;
};

export const AppointmentInfo = ({
  lesson,
  teacherName,
  price,
}: AppointmentInfoProps) => {
  return (
    <div className="flex-1 flex flex-col gap-1 md:gap-2">
      {lesson && (
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center justify-center border border-light-300 text-[12px] md:text-[14px] text-light-100 rounded-full bg-dark-900 px-4 md:px-6 py-1">
            {lesson}
          </span>
        </div>
      )}

      <h3 className="text-white text-[16px] md:text-[18px] font-semibold">
        {teacherName || "Teacher"}
      </h3>

      <div className="text-[14px] md:text-[16px] text-white">
        {price} euro /hour
      </div>
    </div>
  );
};
