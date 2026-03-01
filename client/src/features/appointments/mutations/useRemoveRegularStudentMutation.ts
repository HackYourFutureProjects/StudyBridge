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
        queryKey: queryKeys.appointments,
      });
    },
  });
};
