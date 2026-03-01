import { apiProtected as api } from "../api";
import {
  Appointment,
  WeeklyScheduleSlot,
} from "../../types/appointments.types";

export const setRegularStudentApi = async (
  appointmentId: string,
): Promise<Appointment> => {
  const response = await api.post(
    `/api/appointments/${appointmentId}/set-regular`,
  );
  return response.data;
};

export const removeRegularStudentApi = async (
  appointmentId: string,
): Promise<Appointment> => {
  const response = await api.delete(
    `/api/appointments/${appointmentId}/remove-regular`,
  );
  return response.data;
};

export const updateWeeklyScheduleApi = async (
  appointmentId: string,
  weeklySchedule: WeeklyScheduleSlot[],
): Promise<Appointment> => {
  const response = await api.put(
    `/api/appointments/${appointmentId}/weekly-schedule`,
    {
      weeklySchedule,
    },
  );
  return response.data;
};

export const getRegularStudentsApi = async (
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

  const response = await api.get(
    `/api/appointments/regular/students?${params.toString()}`,
  );
  return response.data;
};

export const getRegularTeachersApi = async (
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

  const response = await api.get(
    `/api/appointments/regular/teachers?${params.toString()}`,
  );
  return response.data;
};
