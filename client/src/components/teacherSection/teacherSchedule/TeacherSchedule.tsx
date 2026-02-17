import { useState } from "react";
import { Calendar } from "./Calendar/Calendar";
import { Time } from "./Time/Time";
import { Button } from "../../ui/button/Button";
import { TeacherType } from "../../../api/teacher/teacher.type";
import { useModalStore } from "../../../store/modals.store";

interface TeacherScheduleProps {
  teacher?: TeacherType;
}

export default function TeacherSchedule({ teacher }: TeacherScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showTimeAndBook, setShowTimeAndBook] = useState<boolean>(false);

  const { open: openModal } = useModalStore();

  const handleDateSelection = (date: Date): void => {
    setSelectedDate(date);
    setShowTimeAndBook(true);
  };

  const handleTimeSelection = (time: string): void => {
    setSelectedTime(time);
  };

  const handleBook = (): void => {
    if (selectedDate && selectedTime && teacher) {
      openModal("bookingConfirm", {
        teacher,
        selectedDate,
        selectedTime,
        onSuccess: () => {
          setSelectedDate(null);
          setSelectedTime(null);
          setShowTimeAndBook(false);
        },
      });
    }
  };

  const getAvailableTimeSlots = (): string[] => {
    if (!teacher || !selectedDate) {
      return [];
    }

    const dayName = selectedDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase() as keyof typeof teacher.availability;

    const dayAvailability = teacher.availability?.[dayName];

    if (!dayAvailability || dayAvailability.length === 0) {
      const defaultSlots: string[] = [];
      for (let hour = 9; hour < 18; hour++) {
        defaultSlots.push(`${hour.toString().padStart(2, "0")}:00`);
      }
      return defaultSlots;
    }

    const slots: string[] = [];
    dayAvailability.forEach((slot) => {
      const timeRegex = /^(\d{1,2}):(\d{2})$/;
      const startMatch = slot.start.match(timeRegex);
      const endMatch = slot.end.match(timeRegex);

      if (!startMatch || !endMatch) {
        return;
      }

      const startHour = parseInt(startMatch[1], 10);
      const endHour = parseInt(endMatch[1], 10);

      if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
        return;
      }

      for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
      }
    });

    return slots;
  };

  return (
    <div>
      <div className="bg-[#15141D] py-[40px] sm:py-[48px] px-[50px] relative rounded-3xl w-auto h-auto border border-[#7286FF]">
        <div className="flex flex-col items-center justify-center h-full sm:items-start sm:justify-start">
          <div className="text-left w-full">
            <h2 className="text-5xl font-bold text-[#7186FF]">Schedule</h2>
            {teacher?.timezone && (
              <p className="text-sm text-gray-400 mt-2">
                All times shown in teachers timezone: {teacher.timezone}
              </p>
            )}

            <div className="mt-8 sm:mx-0">
              <Calendar
                onDateSelect={handleDateSelection}
                selectedDate={selectedDate}
              />
            </div>

            {showTimeAndBook && (
              <div className="mt-8">
                <Time
                  onTimeSelect={handleTimeSelection}
                  availableSlots={getAvailableTimeSlots()}
                />
              </div>
            )}

            {showTimeAndBook && selectedTime && (
              <div className="mt-8">
                <Button variant="secondary" onClick={handleBook}>
                  Book Lesson - €{teacher?.priceFrom || 0}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
