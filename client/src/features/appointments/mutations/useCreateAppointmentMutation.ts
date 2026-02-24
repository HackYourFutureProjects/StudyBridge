import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { Appointment } from "../../../types/appointments.types";
import { apiProtected } from "../../../api/api";
import { useNotificationStore } from "../../../store/notification.store";
import { getErrorMessage } from "../../../util/ErrorUtil";

interface CreateAppointmentRequest {
  teacherId: string;
  studentId: string;
  date: string;
  time: string;
  lesson: string;
  price: string;
}

const createAppointment = async (
  data: CreateAppointmentRequest,
): Promise<Appointment> => {
  const response = await apiProtected.post<Appointment>(
    "/api/appointments",
    data,
  );
  return response.data;
};

export const useCreateAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const notifySuccess = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.teacherAppointments(variables.teacherId),
      });
      notifySuccess(
        "Booking successful! The teacher will review your request.",
      );
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg ?? "Booking failed. Please try again.");
    },
  });
};
