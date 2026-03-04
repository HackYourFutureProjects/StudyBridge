import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReviewApi } from "../../../api/review/review.api";
import { queryKeys } from "../../queryKeys";
import { useNotificationStore } from "../../../store/notification.store";
import { getErrorMessage } from "../../../util/ErrorUtil";

export const useCreateReviewMutation = (teacherId: string) => {
  const queryClient = useQueryClient();
  const notifySuccess = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  return useMutation({
    mutationFn: createReviewApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reviews", teacherId] });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.reviewAverageRating(teacherId),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.teacherPublic(teacherId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.teacherModerator(teacherId),
      });

      notifySuccess("Review submitted successfully!");
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg ?? "Failed to submit review. Please try again.");
    },
  });
};
