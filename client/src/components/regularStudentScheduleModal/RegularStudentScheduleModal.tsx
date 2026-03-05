import { useState, useMemo } from "react";
import { Button } from "../ui/button/Button";
import Cross from "../icons/Cross";
import { SelectComponent } from "../ui/select/Select";
import { WeeklyScheduleSlot } from "../../types/appointments.types";
import { useModalStore } from "../../store/modals.store";

interface RegularStudentScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: WeeklyScheduleSlot[]) => void;
  studentName: string;
  initialSchedule?: WeeklyScheduleSlot[];
  occupiedSlots?: WeeklyScheduleSlot[];
}

const DAYS = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

const HOURS = Array.from({ length: 17 }, (_, i) => ({
  value: (i + 7).toString(),
  label: `${i + 7}:00`,
}));

const ModalContent = ({
  onClose,
  onSave,
  studentName,
  initialSchedule = [],
  occupiedSlots = [],
}: Omit<RegularStudentScheduleModalProps, "isOpen">) => {
  const initialSavedSlots = useMemo(() => initialSchedule, [initialSchedule]);
  const [savedSlots, setSavedSlots] =
    useState<WeeklyScheduleSlot[]>(initialSavedSlots);
  const [currentDay, setCurrentDay] = useState<string>("Monday");
  const [currentHour, setCurrentHour] = useState<number>(7);
  const { open: openModal } = useModalStore();

  const isDuplicate = savedSlots.some(
    (slot) => slot.day === currentDay && slot.hour === currentHour,
  );

  const isOccupied = occupiedSlots.some(
    (slot) => slot.day === currentDay && slot.hour === currentHour,
  );

  const cannotAdd = isDuplicate || isOccupied;

  const handleAddLesson = () => {
    if (cannotAdd) return;

    const newSlot = { day: currentDay, hour: currentHour };
    const updatedSlots = [...savedSlots, newSlot];
    setSavedSlots(updatedSlots);

    const nextHour = currentHour + 1;
    if (nextHour <= 23) {
      setCurrentHour(nextHour);
    } else {
      const currentDayIndex = DAYS.findIndex((d) => d.value === currentDay);
      if (currentDayIndex < DAYS.length - 1) {
        setCurrentDay(DAYS[currentDayIndex + 1].value);
        setCurrentHour(7);
      } else {
        setCurrentDay("Monday");
        setCurrentHour(7);
      }
    }
  };

  const handleRemoveSlot = (index: number) => {
    setSavedSlots(savedSlots.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!hasScheduleChanged) {
      openModal("alert", {
        title: "No Changes Made",
        message:
          "Please click on 'Add to Schedule' button to add lessons before saving.",
      });
      return;
    }

    onSave(savedSlots);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const hasScheduleChanged = (() => {
    if (savedSlots.length !== initialSavedSlots.length) {
      return true;
    }

    const sortSlots = (slots: WeeklyScheduleSlot[]) =>
      [...slots].sort((a, b) => {
        if (a.day !== b.day) return a.day.localeCompare(b.day);
        return a.hour - b.hour;
      });

    const sortedSaved = sortSlots(savedSlots);
    const sortedInitial = sortSlots(initialSavedSlots);

    return !sortedSaved.every(
      (slot, index) =>
        slot.day === sortedInitial[index]?.day &&
        slot.hour === sortedInitial[index]?.hour,
    );
  })();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2A2433] rounded-2xl p-4 sm:p-6 lg:p-10 w-full max-w-5xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-6 lg:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Weekly Schedule for {studentName}
          </h2>
          <button
            onClick={handleCancel}
            className="text-white hover:text-purple-400 transition-colors"
          >
            <Cross width={14} height={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {savedSlots.length > 0 && (
            <div className="mb-6 lg:mb-8">
              <h3 className="text-white text-base sm:text-lg font-semibold mb-3 lg:mb-4">
                Scheduled Lessons ({savedSlots.length})
              </h3>
              <div className="space-y-2 lg:space-y-3">
                {savedSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="bg-[#1E1D28] rounded-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
                  >
                    <span className="text-white text-sm sm:text-base">
                      {slot.day}, {slot.hour}:00
                    </span>
                    <button
                      onClick={() => handleRemoveSlot(index)}
                      className="text-red-400 hover:text-red-300 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded hover:bg-red-400/10 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 lg:space-y-6">
            <h3 className="text-white text-lg sm:text-xl font-semibold">
              Add Lesson
            </h3>

            <div className="bg-[#1E1D28] rounded-xl p-4 sm:p-6 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 mb-6 lg:mb-8">
                <div>
                  <label className="block text-gray-300 text-sm sm:text-base lg:text-lg font-medium mb-3 lg:mb-5">
                    Day
                  </label>
                  <SelectComponent
                    options={DAYS}
                    value={currentDay}
                    onChange={(value) => setCurrentDay(value)}
                    placeholder="Select day"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm sm:text-base lg:text-lg font-medium mb-3 lg:mb-5">
                    Time
                  </label>
                  <SelectComponent
                    options={HOURS}
                    value={currentHour.toString()}
                    onChange={(value) => setCurrentHour(parseInt(value))}
                    placeholder="Select time"
                  />
                </div>
              </div>

              {isDuplicate && (
                <div className="mb-4 px-3 sm:px-4 py-2 sm:py-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-xs sm:text-sm">
                    This time slot is already added to the schedule
                  </p>
                </div>
              )}

              {isOccupied && !isDuplicate && (
                <div className="mb-4 px-3 sm:px-4 py-2 sm:py-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-xs sm:text-sm">
                    This time slot is already occupied by another Regular
                    Student
                  </p>
                </div>
              )}

              <Button
                onClick={handleAddLesson}
                variant="secondary"
                className="w-full text-sm sm:text-base py-3 sm:py-4"
                disabled={cannotAdd}
              >
                {isDuplicate
                  ? "Time Slot Already Added"
                  : isOccupied
                    ? "Time Slot Occupied"
                    : "+ Add to Schedule"}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700 flex flex-col lg:flex-row justify-end gap-3 sm:gap-5">
          <Button
            onClick={handleCancel}
            variant="secondary"
            className="px-6 sm:px-10 py-2 sm:py-3 text-sm sm:text-base order-2 lg:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            className="px-6 sm:px-10 py-2 sm:py-3 text-sm sm:text-base order-1 lg:order-2"
          >
            Save Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

export const RegularStudentScheduleModal = ({
  isOpen,
  ...props
}: RegularStudentScheduleModalProps) => {
  if (!isOpen) return null;

  return <ModalContent {...props} />;
};
