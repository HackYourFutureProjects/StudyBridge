type TeacherAppointmentInfoProps = {
  lesson?: string;
  studentName?: string;
  price: string;
};

export const TeacherAppointmentInfo = ({
  lesson,
  studentName,
  price,
}: TeacherAppointmentInfoProps) => {
  return (
    <div className="flex-1 flex flex-col gap-2">
      {lesson && (
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center justify-center border border-light-300 text-[14px] text-light-100 rounded-full bg-dark-900 px-6 py-1">
            {lesson}
          </span>
        </div>
      )}

      <h3 className="text-white text-[18px] font-semibold">
        {studentName || "Student"}
      </h3>

      <div className="text-[16px] text-white">{price} euro /hour</div>
    </div>
  );
};
