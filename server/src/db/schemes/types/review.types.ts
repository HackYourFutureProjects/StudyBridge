import { Types } from "mongoose";
export interface ReviewTypeDB {
  teacherId: Types.ObjectId | string;
  studentId: Types.ObjectId | string;
  bookingId: Types.ObjectId | string;
  rating: number;
  review?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  subject: string;
  studentName: string;
  studentAvatar?: string | null;
}
