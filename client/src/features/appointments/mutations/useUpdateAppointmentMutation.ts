import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import {
  Appointment,
  AppointmentStatus,
} from "../../../types/appointments.types";

interface UpdateAppointmentRequest {
  appointmentId: string;
  status: AppointmentStatus;
}

const updateAppointmentStatus = async (
  data: UpdateAppointmentRequest,
): Promise<Appointment> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    id: data.appointmentId,
    lesson: "English",
    teacher: "1",
    student: "Anna Tkachuk",
    price: "25 euro",
    date: "5/27/15",
    time: "2:00 PM",
    status: data.status,
    videoCall: `https://meet.google.com/1-anna-${data.appointmentId}`,
  };
};

export const useUpdateAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments,
      });
    },
    onError: (error) => {
      console.error("Failed to update appointment status:", error);
    },
  });
};
