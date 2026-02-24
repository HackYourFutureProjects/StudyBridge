import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReviewApi } from "../../../api/review/review.api";
import { queryKeys } from "../../queryKeys";

export const useCreateReviewMutation = (teacherId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReviewApi,
    onSuccess: () => {
      // refresh the reviews list
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews(teacherId),
      });

      // refresh the teacher profile to update the average rating
      queryClient.invalidateQueries({
        queryKey: queryKeys.teacher(teacherId),
      });
    },
  });
};
