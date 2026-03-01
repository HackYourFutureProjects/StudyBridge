import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setRegularStudentApi } from "../../../api/appointments/regularStudents.api";
import { queryKeys } from "../../queryKeys";

export const useSetRegularStudentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => setRegularStudentApi(appointmentId),
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
