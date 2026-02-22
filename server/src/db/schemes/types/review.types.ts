export interface ReviewTypeDB {
  teacherId: string;
  studentId: string;
  bookingId: string;
  rating: number;
  review?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  subject: string;
  studentName: string;
  studentAvatar?: string | null;
}
