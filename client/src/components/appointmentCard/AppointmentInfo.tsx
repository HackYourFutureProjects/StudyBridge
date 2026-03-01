import { WeeklyScheduleSlot } from "../../types/appointments.types";

export type AppointmentInfoProps = {
  lesson?: string;
  teacherName?: string;
  price: string;
  weeklySchedule?: WeeklyScheduleSlot[];
  isRegularTeacher?: boolean;
};

const formatSchedule = (weeklySchedule: WeeklyScheduleSlot[]) => {
  const scheduleByDay: Record<string, number[]> = {};
  weeklySchedule.forEach((slot) => {
    if (!scheduleByDay[slot.day]) {
      scheduleByDay[slot.day] = [];
    }
    scheduleByDay[slot.day].push(slot.hour);
  });

  Object.keys(scheduleByDay).forEach((day) => {
    scheduleByDay[day].sort((a, b) => a - b);
  });

  return Object.entries(scheduleByDay)
    .map(([day, hours]) => {
      const hoursStr = hours.map((h) => `${h}:00`).join(", ");
      return `${day}: ${hoursStr}`;
    })
    .join(" • ");
};

export const AppointmentInfo = ({
  lesson,
  teacherName,
  price,
  weeklySchedule,
  isRegularTeacher = false,
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

      {isRegularTeacher && weeklySchedule && weeklySchedule.length > 0 && (
        <div className="text-[11px] md:text-[13px] text-gray-400 mt-1 max-w-full">
          {formatSchedule(weeklySchedule)}
        </div>
      )}
    </div>
  );
};
