import { useState, useMemo } from "react";
import { Button } from "../ui/button/Button.tsx";
import Cross from "../icons/Cross.tsx";

interface TimeSlot {
  day: string;
  hour: number;
}

interface LessonScheduleProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slots: TimeSlot[]) => Promise<void> | void;
  initialSlots?: TimeSlot[];
  bookedSlots?: TimeSlot[];
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

const ModalContent = ({
  onClose,
  onSave,
  initialSlots = [],
  bookedSlots = [],
}: Omit<LessonScheduleProps, "isOpen">) => {
  const initialSelectedSlots = useMemo(
    () => new Set(initialSlots.map((slot) => `${slot.day}-${slot.hour}`)),
    [initialSlots],
  );

  const [selectedSlots, setSelectedSlots] =
    useState<Set<string>>(initialSelectedSlots);

  const blockedSlots = useMemo(
    () => new Set(bookedSlots.map((slot) => `${slot.day}-${slot.hour}`)),
    [bookedSlots],
  );

  const toggleSlot = (day: string, hour: number) => {
    const key = `${day}-${hour}`;

    if (blockedSlots.has(key)) {
      return;
    }

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

        <div className="overflow-x-auto overflow-y-auto scrollbar-visible">
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
                      const isBlocked = blockedSlots.has(key);

                      return (
                        <td
                          key={hour}
                          onClick={() => !isBlocked && toggleSlot(day, hour)}
                          className={`border border-gray-600 p-1 transition-colors min-w-[60px] min-h-[50px] ${
                            isBlocked
                              ? "bg-red-900 cursor-not-allowed"
                              : isSelected
                                ? "bg-purple-500 hover:bg-purple-600 cursor-pointer"
                                : "bg-gray-700 hover:bg-gray-600 cursor-pointer"
                          }`}
                        ></td>
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
            <span className="text-white text-sm">Available time</span>
          </div>
          {bookedSlots.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-900 rounded"></div>
              <span className="text-white text-sm">Regular Students</span>
            </div>
          )}
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

export const LessonSchedule = ({ isOpen, ...props }: LessonScheduleProps) => {
  if (!isOpen) return null;

  return <ModalContent {...props} />;
};
