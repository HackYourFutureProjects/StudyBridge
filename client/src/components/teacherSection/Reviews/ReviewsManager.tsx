import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReviewsQuery } from "../../../features/review/query/useReviewsQuery";
import { ReviewsTeacher } from "./ReviewsTeacher";
import { ReviewType } from "../../../api/review/review.type";

export const ReviewsManager = () => {
  const { id: teacherId } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [accumulatedReviews, setAccumulatedReviews] = useState<ReviewType[]>(
    [],
  );
  const pageSize = 3;

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
    <ReviewsTeacher
      reviews={accumulatedReviews}
      isLoading={isLoading}
      onLoadMore={handleLoadMore}
      hasMore={hasMore}
    />
  );
};
