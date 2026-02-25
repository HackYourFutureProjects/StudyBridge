import React, { useState } from "react";
import { Button } from "../../ui/button/Button";
import { useCreateReviewMutation } from "../../../features/review/mutations/useCreateReviewMutation";
import { useStudentAppointmentsQuery } from "../../../features/appointments/query/useAppointmentsQuery";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { Appointment } from "../../../types/appointments.types";

interface AddReviewFormProps {
  teacherId: string;
}

export const AddReview = ({ teacherId }: AddReviewFormProps) => {
  const { user } = useAuthSessionStore();
  const studentId = user?.id || "";

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState("");

  const { data } = useStudentAppointmentsQuery(studentId);

  // Filter to only approved lessons with this teacher
  const approvedLessons = data?.appointments.filter(
    (app) => app.teacherId === teacherId && app.status === "approved",
  );

  const { mutate, isPending } = useCreateReviewMutation(teacherId);

  // Find the selected booking details for use in the review
  const selectBooking = approvedLessons?.find(
    (app: Appointment) => app.id === selectedBookingId,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating");
    if (!selectedBookingId) return alert("BookingID is required");

    mutate(
      {
        teacherId,
        bookingId: selectedBookingId,
        rating,
        review: reviewText,
        subject: selectBooking?.lesson || "",
      },
      {
        onSuccess: () => {
          setRating(0);
          setReviewText("");
          setSelectedBookingId("");
        },
      },
    );
  };
  return (
    <div className="bg-[#1A1926] mb-12 p-8 border border-white/5 rounded-2xl">
      <h3 className="mb-6 font-bold text-white text-2xl">Review Your Lesson</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="lesson-select"
            className="block mb-2 text-white/60 text-sm"
          >
            Select a lesson
          </label>
          <select
            id="lesson-select"
            className="bg-dark px-4 py-3 border border-white/10 focus:border-primary-500 rounded-lg outline-none w-full text-white"
            value={selectedBookingId}
            onChange={(e) => setSelectedBookingId(e.target.value)}
            required
          >
            <option value="" className="bg-black text-white">
              -- Choose a lesson --
            </option>

            {approvedLessons?.map((app: Appointment) => (
              <option
                key={app.id}
                value={app.id}
                className="bg-black text-white"
              >
                {app.lesson} - {new Date(app.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Stars */}
        <div>
          <label className="block mb-2 text-white/60 text-sm">
            How was the lesson?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition ${star <= rating ? "text-yellow-400" : "text-gray-600 cursor-pointer"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-white/60 text-sm">
            Review - (Optional)
          </label>
          <textarea
            placeholder="What did you learn? How was the teaching style?"
            className="bg-dark px-4 py-3 border border-white/10 rounded-lg w-full h-32 text-white resize-none"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </div>

        <Button
          variant="primary"
          disabled={isPending || !selectedBookingId}
          className="disabled:bg-gray-600 py-4 w-full disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
};
