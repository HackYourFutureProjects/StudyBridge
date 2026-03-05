import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeRegularStudentApi } from "../../../api/appointments/regularStudents.api";
import { queryKeys } from "../../queryKeys";
import { useNotificationStore } from "../../../store/notification.store";

export const useRemoveRegularStudentMutation = () => {
  const queryClient = useQueryClient();
  const success = useNotificationStore((s) => s.success);

  return useMutation({
    mutationFn: (appointmentId: string) =>
      removeRegularStudentApi(appointmentId),
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
      success("Student removed from regular list successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to remove regular student:", error);
      if (error && typeof error === "object" && "response" in error) {
        console.error(
          "Error response:",
          (error as { response?: { data?: unknown } }).response?.data,
        );
      }
    },
  });
};
