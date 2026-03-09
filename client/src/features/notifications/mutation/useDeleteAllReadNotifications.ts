import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAllReadNotifications } from "../../../api/notifications/notifications.api.ts";
import { useNotificationFeedStore } from "../../../store/notificationFeed.store.ts";
import { useNotificationStore } from "../../../store/notification.store.ts";
import { getErrorMessage } from "../../../util/ErrorUtil.ts";
import { notificationKeys } from "../../queryKeys.ts";

export const useDeleteAllReadNotifications = () => {
  const queryClient = useQueryClient();
  const items = useNotificationFeedStore((s) => s.items);
  const setItems = useNotificationFeedStore((s) => s.setItems);
  const notifyError = useNotificationStore((s) => s.error);

  return useMutation({
    mutationFn: deleteAllReadNotifications,
    onSuccess: () => {
      const unreadOnly = items.filter((item) => !item.isRead);

      setItems(unreadOnly);
      queryClient.setQueryData(notificationKeys.root, unreadOnly);
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg ?? "Failed to clear read notifications");
    },
  });
};
