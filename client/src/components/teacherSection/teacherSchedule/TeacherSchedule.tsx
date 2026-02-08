import { useState } from "react";
import { Calendar } from "./Calendar/Calendar";
import { Time } from "./Time/Time";
import { Button } from "../../ui/button/Button";
import { Modal } from "../../ui/modal/Modal";
import { TeacherType } from "../../../types/teacher.types";

interface TeacherScheduleProps {
  teacher?: TeacherType;
}

export default function TeacherSchedule({ teacher }: TeacherScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showTimeAndBook, setShowTimeAndBook] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const handleDateSelection = (date: Date): void => {
    setSelectedDate(date);
    setShowTimeAndBook(true);
  };

  const handleTimeSelection = (time: string): void => {
    setSelectedTime(time);
  };

  const handleBook = (): void => {
    if (selectedDate && selectedTime && teacher) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmBooking = (): void => {
    setShowConfirmModal(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setShowTimeAndBook(false);
  };

  const getAvailableTimeSlots = (): string[] => {
    if (!teacher || !selectedDate) return [];

    const dateStr = selectedDate.toISOString().split("T")[0];
    return teacher.schedule?.[dateStr] || teacher.availableTimeSlots || [];
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
                <Time
                  onTimeSelect={handleTimeSelection}
                  availableSlots={getAvailableTimeSlots()}
                />
              </div>
            )}

            {showTimeAndBook && selectedTime && (
              <div className="mt-8">
                <Button variant="secondary" onClick={handleBook}>
                  Book Lesson - ${teacher?.price || 0}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Booking"
        onConfirm={handleConfirmBooking}
        confirmText="Book Now"
        cancelText="Cancel"
      >
        <div className="space-y-2">
          <p>
            <strong>Teacher:</strong> {teacher?.name}
          </p>
          <p>
            <strong>Subject:</strong> {teacher?.subject}
          </p>
          <p>
            <strong>Date:</strong> {selectedDate?.toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong> {selectedTime}
          </p>
          <p>
            <strong>Price:</strong> ${teacher?.price}
          </p>
          <p className="text-sm text-gray-600 mt-4">
            The lesson request will be sent to the teacher.
          </p>
        </div>
      </Modal>
    </div>
  );
}
