import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReviewApi } from "../../../api/review/review.api";
import { queryKeys } from "../../queryKeys";

export const useCreateReviewMutation = (teacherId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReviewApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews(teacherId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.reviewAverageRating(teacherId),
      });
    },
  });
};
