import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { Appointment } from "../../../types/appointments.types";
import { apiProtected } from "../../../api/api";

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

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments,
      });
    },
  });
};
