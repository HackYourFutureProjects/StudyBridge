import { useState } from "react";
import { Button } from "../ui/button/Button.tsx";
import Cross from "../icons/Cross.tsx";

interface TimeSlot {
  day: string;
  hour: number;
}

interface LessonScheduleProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slots: TimeSlot[]) => void;
  initialSlots?: TimeSlot[];
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

const HOURS = Array.from({ length: 24 }, (_, i) => i + 7); // 7:00 to 30:00 (next day 6:00)

export const LessonSchedule = ({
  isOpen,
  onClose,
  onSave,
  initialSlots = [],
}: LessonScheduleProps) => {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(
    () => new Set(initialSlots.map((slot) => `${slot.day}-${slot.hour}`)),
  );

  if (!isOpen) return null;

  const toggleSlot = (day: string, hour: number) => {
    const key = `${day}-${hour}`;
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

  const handleSave = () => {
    const slots: TimeSlot[] = Array.from(selectedSlots).map((key) => {
      const [day, hour] = key.split("-");
      return { day, hour: parseInt(hour) };
    });
    onSave(slots);
    onClose();
  };

  const formatHour = (hour: number) => {
    if (hour >= 24) return `${hour - 24}:00`;
    return `${hour}:00`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2A2433] rounded-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Lesson schedule</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-400 transition-colors"
          >
            <Cross width={12} height={12} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-600 p-2"></th>
                {HOURS.slice(0, 17).map((hour) => (
                  <th
                    key={hour}
                    className="border border-gray-600 p-2 text-white text-sm"
                  >
                    {formatHour(hour)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day}>
                  <td className="border border-gray-600 p-3 text-white font-medium">
                    {day}
                  </td>
                  {HOURS.slice(0, 17).map((hour) => {
                    const key = `${day}-${hour}`;
                    const isSelected = selectedSlots.has(key);
                    return (
                      <td
                        key={hour}
                        onClick={() => toggleSlot(day, hour)}
                        className={`border border-gray-600 p-3 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-purple-500 hover:bg-purple-600"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      ></td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded"></div>
            <span className="text-white text-sm">free time lesson</span>
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
