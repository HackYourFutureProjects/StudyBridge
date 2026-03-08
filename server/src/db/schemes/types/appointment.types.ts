export interface WeeklyScheduleSlot {
  day: string;
  hour: number;
}

export interface AppointmentTypeDB {
  id: string;
  studentId: string;
  teacherId: string;
  lesson: string;
  level?: string;
  teacher: string;
  student: string;
  teacherName?: string;
  studentName?: string;
  studentProfileImageUrl?: string | null;
  price: string;
  date: string;
  time: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  videoCall?: string;
  isRegularStudent?: boolean;
  weeklySchedule?: WeeklyScheduleSlot[];
  addedToRegularAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
