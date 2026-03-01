import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWeeklyScheduleApi } from "../../../api/appointments/regularStudents.api";
import { queryKeys } from "../../queryKeys";
import { WeeklyScheduleSlot } from "../../../types/appointments.types";

export const useUpdateWeeklyScheduleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      weeklySchedule,
    }: {
      appointmentId: string;
      weeklySchedule: WeeklyScheduleSlot[];
    }) => updateWeeklyScheduleApi(appointmentId, weeklySchedule),
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
  });
};
