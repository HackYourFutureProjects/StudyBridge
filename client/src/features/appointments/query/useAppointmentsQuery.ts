import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../queryKeys";
import { Appointment } from "../../../types/appointments.types";
import { api } from "../../../api/api";

const fetchAppointmentsByTeacher = async (
  teacherId: string,
): Promise<Appointment[]> => {
  const response = await api.get(`/api/appointments/teacher/${teacherId}`);
  return response.data;
};

const fetchAppointmentsByStudent = async (
  studentId: string,
): Promise<Appointment[]> => {
  const response = await api.get(`/api/appointments/student/${studentId}`);
  return response.data;
};

export const useTeacherAppointmentsQuery = (teacherId: string) => {
  return useQuery({
    queryKey: queryKeys.teacherAppointments(teacherId),
    queryFn: () => fetchAppointmentsByTeacher(teacherId),
    enabled: !!teacherId,
  });
};

export const useStudentAppointmentsQuery = (studentId: string) => {
  return useQuery({
    queryKey: queryKeys.studentAppointments(studentId),
    queryFn: () => fetchAppointmentsByStudent(studentId),
    enabled: !!studentId,
  });
};
