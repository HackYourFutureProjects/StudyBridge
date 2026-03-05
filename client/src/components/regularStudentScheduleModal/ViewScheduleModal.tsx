import { WeeklyScheduleSlot } from "../../types/appointments.types";
import { Button } from "../ui/button/Button";
import Cross from "../icons/Cross";

interface ViewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  schedule: WeeklyScheduleSlot[];
}

export const ViewScheduleModal = ({
  isOpen,
  onClose,
  teacherName,
  schedule,
}: ViewScheduleModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2A2433] rounded-2xl p-4 sm:p-6 lg:p-10 w-full max-w-4xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-6 lg:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Weekly Schedule with {teacherName}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-purple-400 transition-colors"
          >
            <Cross width={14} height={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {schedule.length === 0 ? (
            <div className="text-center py-8 lg:py-12">
              <p className="text-gray-400 text-base lg:text-lg">
                No schedule set yet
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Your teacher hasn&apos;t set up a weekly schedule yet
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-white text-base sm:text-lg font-semibold mb-4 lg:mb-6">
                Your Lessons ({schedule.length} per week)
              </h3>
              <div className="space-y-3 lg:space-y-4">
                {schedule.map((slot, index) => (
                  <div
                    key={index}
                    className="bg-[#1E1D28] rounded-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 flex items-center"
                  >
                    <div className="flex-1">
                      <span className="text-white text-base sm:text-lg font-medium">
                        {slot.day}
                      </span>
                      <span className="text-gray-400 text-base sm:text-lg ml-2 sm:ml-4">
                        at {slot.hour}:00
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-gray-700 flex justify-center">
          <Button
            onClick={onClose}
            variant="primary"
            className="px-8 sm:px-12 py-2 sm:py-3 text-sm sm:text-base"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
