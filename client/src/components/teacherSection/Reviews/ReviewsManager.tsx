import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReviewsQuery } from "../../../features/review/query/useReviewsQuery";
import { ReviewsTeacher } from "./ReviewsTeacher";
import { ReviewType } from "../../../api/review/review.type";
import { AddReview } from "./AddReview";

export const ReviewsManager = () => {
  const { id: teacherId } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [accumulatedReviews, setAccumulatedReviews] = useState<ReviewType[]>(
    [],
  );
  const pageSize = 6;

  const {
    data: reviewsData,
    isLoading,
    isSuccess,
  } = useReviewsQuery(teacherId ?? "", page, pageSize);

  useEffect(() => {
    if (isSuccess && reviewsData?.reviews) {
      queueMicrotask(() => {
        setAccumulatedReviews((prev) => {
          const existingIds = new Set(prev.map((r) => r._id));
          const uniqueNew = reviewsData.reviews.filter(
            (r: ReviewType) => !existingIds.has(r._id),
          );
          return uniqueNew.length > 0 ? [...prev, ...uniqueNew] : prev;
        });
      });
    }
  }, [reviewsData?.reviews, isSuccess]);

  const hasMore = reviewsData ? reviewsData.pageCount > page : false;

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <>
      <div className="text-center">
        <h2 className="mb-6 sm:mb-8 lg:mb-10 font-bold text-white xl:text-[56px] text-3xl sm:text-4xl lg:text-5xl">
          What our clients say
        </h2>
        <p className="mx-auto mb-12 sm:mb-16 lg:mb-20 px-4 max-w-3xl text-white/70 text-sm sm:text-base lg:text-lg text-justify leading-relaxed">
          Students appreciate the practical approach, supportive instructors,
          and clear learning structure across all courses. Many international
          students highlight fast progress, increased confidence, and a
          comfortable learning environment.
        </p>
      </div>
      <AddReview
        teacherId={teacherId ?? ""}
        accumulatedReviews={accumulatedReviews}
      />
      <ReviewsTeacher
        reviews={accumulatedReviews}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
      />
    </>
  );
};
