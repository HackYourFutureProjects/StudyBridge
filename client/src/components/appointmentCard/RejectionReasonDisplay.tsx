import { Appointment } from "../../types/appointments.types";

interface RejectionReasonDisplayProps {
  appointment: Appointment;
}

export const RejectionReasonDisplay = ({
  appointment,
}: RejectionReasonDisplayProps) => {
  if (appointment.status !== "rejected" || !appointment.rejectionReason) {
    return null;
  }

  return (
    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
      <h4 className="text-sm font-medium text-red-800 mb-2">
        Reason for Rejection:
      </h4>
      <p className="text-sm text-red-700 leading-relaxed">
        {appointment.rejectionReason}
      </p>
    </div>
  );
};
