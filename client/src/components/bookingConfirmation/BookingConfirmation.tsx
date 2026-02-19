import { Button } from "../ui/button/Button";
import { useModalStore } from "../../store/modals.store";
import { useCreateAppointmentMutation } from "../../features/appointments/mutations/useCreateAppointmentMutation";
import { useAuthSessionStore } from "../../store/authSession.store";

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingConfirmation = ({
  isOpen,
  onClose,
}: BookingConfirmationProps) => {
  const payload = useModalStore((state) => state.payload);
  const { mutate: createAppointment, isPending } =
    useCreateAppointmentMutation();
  const user = useAuthSessionStore((state) => state.user);

  if (!payload || !isOpen) return null;

  const {
    teacher,
    selectedDate,
    selectedTime,
    onSuccess: onSuccessCallback,
  } = payload;

  const handleConfirm = () => {
    if (!teacher || !selectedDate || !selectedTime || !user) {
      return;
    }

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    const appointmentData = {
      teacherId: teacher.id,
      studentId: user.id,
      date: dateString,
      time: selectedTime,
      lesson: teacher.subjects?.[0]?.subjectName || "General Lesson",
      price: teacher.priceFrom?.toString() || "0",
    };

    createAppointment(appointmentData, {
      onSuccess: () => {
        onClose();
        onSuccessCallback?.();
      },
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Confirm Booking
      </h2>

      <div className="mb-6 text-gray-700 space-y-2">
        <p>
          <strong>Teacher:</strong> {teacher?.firstName} {teacher?.lastName}
        </p>
        <p>
          <strong>Subject:</strong>{" "}
          {teacher?.subjects?.[0]?.subjectName || "N/A"}
        </p>
        <p>
          <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {selectedTime}
          {teacher?.timezone && (
            <span className="text-sm text-gray-600"> ({teacher.timezone})</span>
          )}
        </p>
        <p>
          <strong>Price:</strong> €{teacher?.priceFrom}
        </p>
        <p className="text-sm text-gray-600 mt-4">
          The lesson request will be sent to the teacher.
        </p>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={isPending}>
          {isPending ? "Booking..." : "Book Now"}
        </Button>
      </div>
    </div>
  );
};
