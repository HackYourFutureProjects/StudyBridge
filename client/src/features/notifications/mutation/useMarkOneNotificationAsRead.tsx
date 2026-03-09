import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "../../../api/notifications/notifications.api.ts";
import { useNotificationFeedStore } from "../../../store/notificationFeed.store.ts";
import { useNotificationStore } from "../../../store/notification.store.ts";
import { notificationKeys } from "../../queryKeys.ts";
import { getErrorMessage } from "../../../util/ErrorUtil.ts";

export const useMarkOneNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const notifyError = useNotificationStore((s) => s.error);

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, notificationId) => {
      const { items, setItems } = useNotificationFeedStore.getState();

      const updated = items.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item,
      );

      setItems(updated);
      queryClient.setQueryData(notificationKeys.root, updated);
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      notifyError(msg ?? "Failed to mark notification as read");
    },
  });
};
