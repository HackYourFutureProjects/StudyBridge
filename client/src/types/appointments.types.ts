export type AppointmentStatus = "pending" | "approved" | "rejected";

export interface Appointment {
  id: string;
  lesson: string;
  level?: string;
  teacher: string;
  student: string;
  price: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  videoCall?: string;
}
