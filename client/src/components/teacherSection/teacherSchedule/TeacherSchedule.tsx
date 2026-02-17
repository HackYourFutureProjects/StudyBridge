import { useState } from "react";
import { Calendar } from "./Calendar/Calendar";
import { Time } from "./Time/Time";
import { Button } from "../../ui/button/Button";
import { Modal } from "../../ui/modal/Modal";
import { TeacherType } from "../../../api/teacher/teacher.type";
import { useCreateAppointmentMutation } from "../../../features/appointments/mutations/useCreateAppointmentMutation";
import { useAuthSessionStore } from "../../../store/authSession.store";

interface TeacherScheduleProps {
  teacher?: TeacherType;
}

export default function TeacherSchedule({ teacher }: TeacherScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showTimeAndBook, setShowTimeAndBook] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const { mutate: createAppointment, isPending } =
    useCreateAppointmentMutation();
  const user = useAuthSessionStore((state) => state.user);

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
    if (!teacher || !selectedDate || !selectedTime || !user) {
      console.error("Missing required data for booking");
      return;
    }

    const appointmentData = {
      teacherId: teacher.id,
      studentId: user.id,
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
      lesson: teacher.subjects?.[0]?.subjectName || "General Lesson",
      price: teacher.priceFrom?.toString() || "0",
    };

    createAppointment(appointmentData, {
      onSuccess: () => {
        setShowConfirmModal(false);
        setSelectedDate(null);
        setSelectedTime(null);
        setShowTimeAndBook(false);
        alert("Booking successful! The teacher will review your request.");
      },
      onError: (error) => {
        console.error("Booking failed:", error);
        alert("Booking failed. Please try again.");
      },
    });
  };

  const getAvailableTimeSlots = (): string[] => {
    if (!teacher || !selectedDate) {
      console.log("No teacher or selected date");
      return [];
    }

    const dayName = selectedDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase() as keyof typeof teacher.availability;

    console.log("Day name:", dayName);
    console.log("Teacher availability:", teacher.availability);

    const dayAvailability = teacher.availability?.[dayName];
    console.log("Day availability:", dayAvailability);

    if (!dayAvailability || dayAvailability.length === 0) {
      console.log("No availability for this day - showing default slots");
      //to do  Return default time slots if no availability set
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
        console.warn(`Invalid time format: ${slot.start} - ${slot.end}`);
        return;
      }

      const startHour = parseInt(startMatch[1], 10);
      const endHour = parseInt(endMatch[1], 10);

      if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
        console.warn(`Invalid hour range: ${startHour} - ${endHour}`);
        return;
      }

      for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
      }
    });

    console.log("Generated slots:", slots);
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

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Booking"
        onConfirm={handleConfirmBooking}
        confirmText={isPending ? "Booking..." : "Book Now"}
        cancelText="Cancel"
      >
        <div className="space-y-2">
          <p>
            <strong>Teacher:</strong> {teacher?.firstName} {teacher?.lastName}
          </p>
          <p>
            <strong>Subject:</strong>{" "}
            {teacher?.subjects?.[0]?.subjectName || "N/A"}
          </p>
          <p>
            <strong>Date:</strong> {selectedDate?.toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong> {selectedTime}
            {teacher?.timezone && (
              <span className="text-sm text-gray-600">
                {" "}
                ({teacher.timezone})
              </span>
            )}
          </p>
          <p>
            <strong>Price:</strong> €{teacher?.priceFrom}
          </p>
          <p className="text-sm text-gray-600 mt-4">
            The lesson request will be sent to the teacher.
          </p>
        </div>
      </Modal>
    </div>
  );
}
