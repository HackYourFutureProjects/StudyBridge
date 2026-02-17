import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { Appointment } from "../../../types/appointments.types";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { apiProtected } from "../../../api/api";

const fetchTeacherAppointments = async (
  teacherId: string,
): Promise<Appointment[]> => {
  const response = await apiProtected.get(
    `/api/appointments/teacher/${teacherId}`,
  );
  return response.data;
};

export const useTeacherAppointmentsQuery = () => {
  const user = useAuthSessionStore((state) => state.user);

  return useQuery({
    queryKey: queryKeys.teacherAppointments(user?.id || ""),
    queryFn: () => fetchTeacherAppointments(user?.id || ""),
    enabled: !!user?.id,
  });
};
