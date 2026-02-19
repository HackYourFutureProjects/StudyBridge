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

export const useTeacherAppointmentsQuery = (teacherId?: string) => {
  const user = useAuthSessionStore((state) => state.user);
  const resolvedTeacherId = teacherId || user?.id || "";

  return useQuery({
    queryKey: queryKeys.teacherAppointments(resolvedTeacherId),
    queryFn: () => fetchTeacherAppointments(resolvedTeacherId),
    enabled: !!resolvedTeacherId && !!user,
  });
};
