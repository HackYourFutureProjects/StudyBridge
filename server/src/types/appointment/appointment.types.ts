export interface CreateAppointmentType {
  studentId: string;
  teacherId: string;
  lesson: string;
  price: string;
  date: string;
  time: string;
}

export interface UpdateAppointmentStatusType {
  status: "approved" | "rejected";
}
