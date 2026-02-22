export type AppointmentStatus = "pending" | "approved" | "rejected";

export interface Appointment {
  id: string;
  lesson: string;
  level?: string;
  teacherId: string;
  studentId: string;
  price: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  videoCall?: string;
}
