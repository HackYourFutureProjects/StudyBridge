import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { Appointment } from "../../../types/appointments.types";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { apiProtected } from "../../../api/api";

const fetchTeacherAppointments = async (
  teacherId: string,
  page?: number,
  limit?: number,
): Promise<{
  appointments: Appointment[];
  total: number;
  totalPages: number;
}> => {
  const params = new URLSearchParams();
  if (page !== undefined && page !== null)
    params.append("page", page.toString());
  if (limit !== undefined && limit !== null)
    params.append("limit", limit.toString());

  const queryString = params.toString();
  const url = `/api/appointments/teacher/${teacherId}${queryString ? `?${queryString}` : ""}`;

  const response = await apiProtected.get(url);
  return response.data;
};

export const useTeacherAppointmentsQuery = (
  teacherId?: string,
  page?: number,
  limit?: number,
) => {
  const user = useAuthSessionStore((state) => state.user);
  const resolvedTeacherId = teacherId || user?.id || "";

  return useQuery({
    queryKey: queryKeys.teacherAppointments(resolvedTeacherId, page, limit),
    queryFn: () => fetchTeacherAppointments(resolvedTeacherId, page, limit),
    enabled: !!resolvedTeacherId,
  });
};
