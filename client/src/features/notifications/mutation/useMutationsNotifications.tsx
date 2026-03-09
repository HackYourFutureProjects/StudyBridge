import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationFeedStore } from "../../../store/notificationFeed.store.ts";
import { markAllNotificationsAsRead } from "../../../api/notifications/notifications.api.ts";
import { getErrorMessage } from "../../../util/ErrorUtil.ts";
import { useNotificationStore } from "../../../store/notification.store.ts";
import { notificationKeys } from "../../queryKeys.ts";

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const notifyError = useNotificationStore((s) => s.error);
  const markAllAsReadLocal = useNotificationFeedStore(
    (s) => s.markAllAsReadLocal,
  );

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: async () => {
      markAllAsReadLocal();

      await queryClient.invalidateQueries({
        queryKey: notificationKeys.root,
      });
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg ?? "Something went wrong with notifications changes");
    },
  });
};
