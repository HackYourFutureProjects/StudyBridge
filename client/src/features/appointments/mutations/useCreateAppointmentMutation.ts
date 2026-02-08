import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { Appointment } from "../../../types/appointments.types";

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
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: Date.now().toString(),
    lesson: data.lesson,
    teacher: data.teacherId,
    student: data.studentId,
    price: data.price,
    date: data.date,
    time: data.time,
    status: "pending",
    videoCall: `https://meet.google.com/${data.teacherId}-${data.studentId}-${Date.now()}`,
  };
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
