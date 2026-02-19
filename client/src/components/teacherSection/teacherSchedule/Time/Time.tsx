import { useState } from "react";

interface TimeProps {
  onTimeSelect: (time: string) => void;
  availableSlots?: string[];
}

export function Time({ onTimeSelect, availableSlots = [] }: TimeProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleTimeClick = (time: string): void => {
    setSelectedTime(time);
    onTimeSelect(time);
  };

  if (availableSlots.length === 0) {
    return (
      <div className="bg-[#2C2436] rounded-xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
          Pick a time
        </h3>
        <p className="text-gray-400 text-center">
          No available time slots for this day
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#2C2436] rounded-xl p-4 sm:p-6 shadow-sm">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
        Pick a time
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
        {availableSlots.map((timeSlot) => (
          <button
            key={timeSlot}
            onClick={() => handleTimeClick(timeSlot)}
            className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              selectedTime === timeSlot
                ? "bg-[#7C86F7] text-white"
                : "bg-[#F3F2F5] text-black hover:text-white hover:bg-[#7C86F7]"
            }`}
          >
            {timeSlot}
          </button>
        ))}
      </div>
    </div>
  );
}
