import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys, queryKeys } from "../../queryKeys";
import {
  Appointment,
  AppointmentStatus,
} from "../../../types/appointments.types";
import { apiProtected } from "../../../api/api";
import { useNotificationStore } from "../../../store/notification.store";
import { getErrorMessage } from "../../../util/ErrorUtil";

interface UpdateAppointmentRequest {
  appointmentId: string;
  status: AppointmentStatus;
  rejectionReason?: string;
}

const updateAppointmentStatus = async (
  data: UpdateAppointmentRequest,
): Promise<Appointment> => {
  const requestBody: { status: AppointmentStatus; rejectionReason?: string } = {
    status: data.status,
  };

  if (data.rejectionReason) {
    requestBody.rejectionReason = data.rejectionReason;
  }

  const response = await apiProtected.put<Appointment>(
    `/api/appointments/${data.appointmentId}/status`,
    requestBody,
  );
  return response.data;
};

export const useUpdateAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const notifySuccess = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  return useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teacherAppointments(appointment.teacherId),
      });
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations });
      queryClient.invalidateQueries({
        queryKey: queryKeys.studentAppointments(appointment.studentId),
      });
      notifySuccess("Appointment status updated successfully");
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg ?? "Failed to update appointment status");
    },
  });
};
