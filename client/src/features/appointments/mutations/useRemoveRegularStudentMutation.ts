import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeRegularStudentApi } from "../../../api/appointments/regularStudents.api";
import { queryKeys } from "../../queryKeys";

export const useRemoveRegularStudentMutation = () => {
  const queryClient = useQueryClient();

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
