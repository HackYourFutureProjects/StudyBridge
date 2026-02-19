import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import {
  Appointment,
  AppointmentStatus,
} from "../../../types/appointments.types";
import { apiProtected } from "../../../api/api";

interface UpdateAppointmentRequest {
  appointmentId: string;
  status: AppointmentStatus;
}

const updateAppointmentStatus = async (
  data: UpdateAppointmentRequest,
): Promise<Appointment> => {
  const response = await apiProtected.put<Appointment>(
    `/api/appointments/${data.appointmentId}/status`,
    { status: data.status },
  );
  return response.data;
};

export const useUpdateAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teacherAppointments(appointment.teacherId),
      });
    },
  });
};
