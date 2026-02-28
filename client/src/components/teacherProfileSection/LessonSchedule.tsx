import { useState } from "react";
import { Button } from "../ui/button/Button.tsx";
import Cross from "../icons/Cross.tsx";

interface TimeSlot {
  day: string;
  hour: number;
}

interface BookedSlot {
  day: string;
  hour: number;
  studentName: string;
  lesson: string;
}

interface LessonScheduleProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slots: TimeSlot[]) => Promise<void> | void;
  initialSlots?: TimeSlot[];
  bookedSlots?: BookedSlot[];
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const HOURS = Array.from({ length: 17 }, (_, i) => i + 7);

const getFirstName = (fullName: string): string => {
  return fullName.split(" ")[0] || fullName;
};

export const LessonSchedule = ({
  isOpen,
  onClose,
  onSave,
  initialSlots = [],
  bookedSlots = [],
}: LessonScheduleProps) => {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(
    () => new Set(initialSlots.map((slot) => `${slot.day}-${slot.hour}`)),
  );

  const bookedSlotsSet = new Set(
    bookedSlots.map((slot) => `${slot.day}-${slot.hour}`),
  );

  if (!isOpen) return null;

  const toggleSlot = (day: string, hour: number) => {
    const key = `${day}-${hour}`;
    if (bookedSlotsSet.has(key)) return;

    setSelectedSlots((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Take selected times, save them, then close this popup.
  const handleSave = async () => {
    const slots: TimeSlot[] = Array.from(selectedSlots).map((key) => {
      const [day, hour] = key.split("-");
      return {
        day: day.charAt(0).toUpperCase() + day.slice(1),
        hour: parseInt(hour, 10),
      };
    });
    await onSave(slots);
    onClose();
  };

  const formatHour = (hour: number) => {
    if (hour >= 24) return `${hour - 24}:00`;
    return `${hour}:00`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2A2433] rounded-2xl p-8 w-full max-w-[95vw] max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Lesson schedule</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-400 transition-colors"
          >
            <Cross width={12} height={12} />
          </button>
        </div>

        <div className="overflow-x-auto overflow-y-auto">
          <div className="min-w-max">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-600 p-2 sticky left-0 bg-[#2A2433] z-10"></th>
                  {HOURS.map((hour) => (
                    <th
                      key={hour}
                      className="border border-gray-600 p-2 text-white text-sm min-w-[60px]"
                    >
                      {formatHour(hour)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => (
                  <tr key={day}>
                    <td className="border border-gray-600 p-3 text-white font-medium sticky left-0 bg-[#2A2433] z-10 min-w-[100px]">
                      {day}
                    </td>
                    {HOURS.map((hour) => {
                      const key = `${day}-${hour}`;
                      const isSelected = selectedSlots.has(key);
                      const isBooked = bookedSlotsSet.has(key);
                      const bookedInfo = bookedSlots.find(
                        (slot) => `${slot.day}-${slot.hour}` === key,
                      );

                      return (
                        <td
                          key={hour}
                          onClick={() => toggleSlot(day, hour)}
                          className={`border border-gray-600 p-1 transition-colors min-w-[60px] min-h-[50px] ${
                            isBooked
                              ? "bg-purple-800 cursor-not-allowed"
                              : isSelected
                                ? "bg-purple-500 hover:bg-purple-600 cursor-pointer"
                                : "bg-gray-700 hover:bg-gray-600 cursor-pointer"
                          }`}
                        >
                          {isBooked && bookedInfo && (
                            <div className="text-white text-[10px] text-center leading-tight">
                              <div className="font-semibold truncate">
                                {getFirstName(bookedInfo.studentName)}
                              </div>
                              <div className="truncate">
                                {bookedInfo.lesson}
                              </div>
                              <div className="text-[9px] opacity-75">
                                (Request)
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded"></div>
            <span className="text-white text-sm">free time lesson</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-800 rounded"></div>
            <span className="text-white text-sm">booked lesson</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={handleSave} variant="primary" className="px-12">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
