import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { Appointment } from "../../../types/appointments.types";
import { apiProtected } from "../../../api/api";

const fetchAppointmentsByStudent = async (
  studentId: string,
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
  const url = `/api/appointments/student/${studentId}${queryString ? `?${queryString}` : ""}`;

  const response = await apiProtected.get(url);
  return response.data;
};

export const useStudentAppointmentsQuery = (
  studentId: string,
  page?: number,
  limit?: number,
) => {
  return useQuery({
    queryKey: queryKeys.studentAppointments(studentId, page, limit),
    queryFn: () => fetchAppointmentsByStudent(studentId, page, limit),
    enabled: !!studentId,
  });
};
