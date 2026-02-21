export interface CreateAppointmentType {
  studentId: string;
  teacherId: string;
  lesson: string;
  level?: string;
  price: string;
  date: string;
  time: string;
}

export interface UpdateAppointmentStatusType {
  status: "pending" | "approved" | "rejected";
}
