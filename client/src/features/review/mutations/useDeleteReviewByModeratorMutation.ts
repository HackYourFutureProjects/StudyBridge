import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReviewByModeratorApi } from "../../../api/review/review.api";
import { queryKeys } from "../../queryKeys";
import { useNotificationStore } from "../../../store/notification.store";
import { getErrorMessage } from "../../../util/ErrorUtil";

export const useDeleteReviewByModeratorMutation = (teacherId: string) => {
  const queryClient = useQueryClient();
  const notifySuccess = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  return useMutation({
    mutationFn: deleteReviewByModeratorApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reviews", teacherId] });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.reviewAverageRating(teacherId),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.teacherModerator(teacherId),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.teacherPublic(teacherId),
      });

      notifySuccess("Review deleted successfully!");
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg ?? "Failed to delete review. Please try again.");
    },
  });
};
