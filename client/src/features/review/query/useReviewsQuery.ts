import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getReviewsApi } from "../../../api/review/review.api";
import { queryKeys } from "../../queryKeys";

export const useReviewsQuery = (
  teacherId: string,
  pageNumber: number,
  pageSize: number,
) => {
  return useQuery({
    queryKey: queryKeys.reviews(teacherId, pageNumber, pageSize),
    queryFn: () => getReviewsApi(teacherId, pageNumber, pageSize),
    enabled: !!teacherId,
    placeholderData: keepPreviousData,
  });
};
