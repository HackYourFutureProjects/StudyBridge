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
  price: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "rejected";
  videoCall?: string;
  isRegularStudent?: boolean;
  weeklySchedule?: WeeklyScheduleSlot[];
  addedToRegularAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
