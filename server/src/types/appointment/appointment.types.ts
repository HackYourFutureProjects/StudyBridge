import { WeeklyScheduleSlot } from "../../db/schemes/types/appointment.types.js";

export { WeeklyScheduleSlot };

export interface CreateAppointmentType {
  studentId: string;
  teacherId: string;
  lesson: string;
  level?: string;
  price: string;
  date: string;
  time: string;
  description?: string;
}

export interface UpdateAppointmentStatusType {
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export interface UpdateWeeklyScheduleType {
  weeklySchedule: WeeklyScheduleSlot[];
}
