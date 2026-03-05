import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setRegularStudentApi } from "../../../api/appointments/regularStudents.api";
import { queryKeys } from "../../queryKeys";
import { useNotificationStore } from "../../../store/notification.store";

export const useSetRegularStudentMutation = () => {
  const queryClient = useQueryClient();
  const success = useNotificationStore((s) => s.success);

  return useMutation({
    mutationFn: (appointmentId: string) => setRegularStudentApi(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.regularStudents(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.regularTeachers(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments,
      });
      queryClient.invalidateQueries({
        queryKey: ["appointments", "teacher"],
      });
      success("Student added to regular list successfully!");
    },
  });
};
