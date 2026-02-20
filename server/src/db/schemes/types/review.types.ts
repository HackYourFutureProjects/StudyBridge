export interface ReviewTypeDB {
  teacherId: string;
  studentId: string;
  bookingId: string;
  rating: number;
  review?: string;
  createdAt: string;
}
