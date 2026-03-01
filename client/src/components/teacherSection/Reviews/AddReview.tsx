import React, { useState } from "react";
import { Button } from "../../ui/button/Button";
import { useCreateReviewMutation } from "../../../features/review/mutations/useCreateReviewMutation";
import { useStudentAppointmentsQuery } from "../../../features/appointments/query/useAppointmentsQuery";
import { useAuthSessionStore } from "../../../store/authSession.store";
import { Appointment } from "../../../types/appointments.types";
import { Loader } from "../../loader/Loader";
import { useNotificationStore } from "../../../store/notification.store";
import { ReviewType } from "../../../api/review/review.type";
import { SelectComponent } from "../../ui/select/Select";

interface AddReviewFormProps {
  teacherId: string;
  accumulatedReviews?: ReviewType[];
}

export const AddReview = ({
  teacherId,
  accumulatedReviews = [],
}: AddReviewFormProps) => {
  const { user } = useAuthSessionStore();
  const isLoggedIn = !!user;
  const studentId = user?.id || "";
  const notifyError = useNotificationStore((s) => s.error);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState("");

  const { data, isLoading } = useStudentAppointmentsQuery(studentId);
  const { mutate, isPending } = useCreateReviewMutation(teacherId);

  // If not logged in, don't show the review form
  if (!isLoggedIn) return null;
  if (isLoading)
    return (
      <div className="flex justify-center p-4">
        <Loader />
      </div>
    );

  // Get the set of bookingIds that already have reviews
  const reviewedBookingIds = new Set(
    accumulatedReviews.map((r) => r.bookingId),
  );

  // Filter to only approved lessons with this teacher, without lessonse already reviewed
  const approvedLessons =
    data?.appointments.filter(
      (app) =>
        app.teacherId === teacherId &&
        app.status === "approved" &&
        !reviewedBookingIds.has(app.id),
    ) || [];

  if (approvedLessons.length === 0) {
    return null;
  }

  // Options list for the select dropdown
  const lessonOptions = approvedLessons.map((app: Appointment) => ({
    value: app.id,
    label: `${app.lesson} ---- ${new Date(app.date).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    )}`,
  }));

  // Find the selected booking details for use in the review
  const selectBooking = approvedLessons?.find(
    (app: Appointment) => app.id === selectedBookingId,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      return notifyError("Please provide a rating for the lesson");
    }
    if (!selectedBookingId)
      return notifyError("Please select a lesson to review");

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
        onError: (error) => {
          const msg =
            error instanceof Error
              ? error.message
              : "Failed to submit review. Please try again.";
          notifyError(msg);
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

          <SelectComponent
            options={lessonOptions}
            value={selectedBookingId}
            onChange={(value) => setSelectedBookingId(value)}
            placeholder="Choose a lesson to review"
          />
        </div>

        {/* Rating Stars */}
        <div>
          <label className="block mb-2 text-white/60 text-sm">
            How was the lesson?
          </label>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition cursor-pointer  ${star <= rating ? "text-yellow-400" : "text-gray-600 "}`}
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
