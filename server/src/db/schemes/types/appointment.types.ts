export interface AppointmentTypeDB {
  id: string;
  studentId: string;
  teacherId: string;
  lesson: string;
  teacher: string;
  student: string;
  price: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "rejected";
  videoCall?: string;
  createdAt: Date;
  updatedAt: Date;
}
