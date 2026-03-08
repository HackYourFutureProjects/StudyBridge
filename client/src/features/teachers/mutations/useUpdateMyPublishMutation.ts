import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyPublishApi } from "../../../api/teacher/teacher.api";
import { queryKeys } from "../../queryKeys";
import { useNotificationStore } from "../../../store/notification.store";
import { getErrorMessage } from "../../../util/ErrorUtil";

export const useUpdateMyPublishMutation = () => {
  const qc = useQueryClient();
  const success = useNotificationStore((s) => s.success);
  const notifyError = useNotificationStore((s) => s.error);

  return useMutation({
    mutationFn: (payload: { isPublic: boolean }) => updateMyPublishApi(payload),
    onSuccess: async (_data, variables) => {
      await qc.invalidateQueries({ queryKey: queryKeys.teachers.myProfile() });
      await qc.invalidateQueries({ queryKey: ["teachers", "publicList"] });
      if (variables.isPublic) {
        success(
          "Sent for review. Your profile will be visible after approval.",
        );
        return;
      }
      success("Profile is now not public.");
    },
    onError: (error) => notifyError(getErrorMessage(error)),
  });
};
