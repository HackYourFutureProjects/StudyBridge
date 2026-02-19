import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { apiProtected } from "../../../api/api";
import { useNotificationStore } from "../../../store/notification.store";
import { getErrorMessage } from "../../../util/ErrorUtil";

const deleteAppointment = async (appointmentId: string): Promise<void> => {
  await apiProtected.delete(`/api/appointments/${appointmentId}`);
};

export const useDeleteAppointmentMutation = () => {
  const queryClient = useQueryClient();
  const notifySuccess = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  return useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments,
      });
      queryClient.invalidateQueries({
        queryKey: ["teacherAppointments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["studentAppointments"],
      });
      notifySuccess("Appointment deleted successfully");
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg ?? "Failed to delete appointment");
    },
  });
};
