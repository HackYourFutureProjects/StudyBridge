import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { Appointment } from "../../../types/appointments.types";
import { apiProtected } from "../../../api/api";

const fetchAppointmentsByTeacher = async (
  teacherId: string,
): Promise<Appointment[]> => {
  const response = await apiProtected.get(
    `/api/appointments/teacher/${teacherId}`,
  );
  return response.data;
};

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
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());

  const queryString = params.toString();
  const url = `/api/appointments/student/${studentId}${queryString ? `?${queryString}` : ""}`;

  const response = await apiProtected.get(url);
  return response.data;
};

export const useTeacherAppointmentsQuery = (teacherId: string) => {
  return useQuery({
    queryKey: queryKeys.teacherAppointments(teacherId),
    queryFn: () => fetchAppointmentsByTeacher(teacherId),
    enabled: !!teacherId,
  });
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
