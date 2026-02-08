import { useState } from "react";
import { Calendar } from "./Calendar/Calendar";
import { Time } from "./Time/Time";
import { Button } from "../../ui/button/Button";

export default function TeacherSchedule() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeAndBook, setShowTimeAndBook] = useState<boolean>(false);

  const handleDateSelection = (date: Date): void => {
    setSelectedDate(date);
    setShowTimeAndBook(true);
  };

  return (
    <div>
      <div className="bg-[#15141D] py-[40px] sm:py-[48px] px-[50px] relative rounded-3xl w-auto h-auto border border-[#7286FF]">
        <div className="flex flex-col items-center justify-center h-full sm:items-start sm:justify-start">
          <div className="text-left w-full">
            <h2 className="text-5xl font-bold text-[#7186FF]">Schedule</h2>

            <div className="mt-8 sm:mx-0">
              <Calendar
                onDateSelect={handleDateSelection}
                selectedDate={selectedDate}
              />
            </div>

            {showTimeAndBook && (
              <div className="mt-8">
                <Time onTimeSelect={() => {}} />
              </div>
            )}

            {showTimeAndBook && (
              <div className="mt-8">
                <Button variant="secondary">Book</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
