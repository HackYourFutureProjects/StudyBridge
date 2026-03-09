import React, { useState } from "react";
import { Appointment } from "../../types/appointments.types";
import { useUpdateAppointmentMutation } from "../../features/appointments/mutations/useUpdateAppointmentMutation";

interface RejectAppointmentModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
}

export const RejectAppointmentModal = ({
  appointment,
  isOpen,
  onClose,
}: RejectAppointmentModalProps) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");
  const updateAppointmentMutation = useUpdateAppointmentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rejectionReason.trim().length < 100) {
      setError("Rejection reason must be at least 100 characters");
      return;
    }

    if (rejectionReason.trim().length > 500) {
      setError("Rejection reason must not exceed 500 characters");
      return;
    }

    try {
      await updateAppointmentMutation.mutateAsync({
        appointmentId: appointment.id,
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
      });
      onClose();
      setRejectionReason("");
      setError("");
    } catch {
      setError("Failed to reject appointment. Please try again.");
    }
  };

  const handleClose = () => {
    onClose();
    setRejectionReason("");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/5 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">Reject Appointment</h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Student:</strong> {appointment.studentName}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Lesson:</strong> {appointment.lesson}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Date & Time:</strong> {appointment.date} at{" "}
            {appointment.time}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="rejectionReason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for Rejection *
            </label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={6}
              placeholder="Please explain why you are rejecting this appointment (100-500 characters)..."
              required
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Minimum 100 characters</span>
              <span
                className={rejectionReason.length > 500 ? "text-red-500" : ""}
              >
                {rejectionReason.length}/500
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={updateAppointmentMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              disabled={
                updateAppointmentMutation.isPending ||
                rejectionReason.trim().length < 100
              }
            >
              {updateAppointmentMutation.isPending
                ? "Rejecting..."
                : "Reject Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
