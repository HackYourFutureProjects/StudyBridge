import { useNotificationsQuery } from "../features/notifications/query/useQueryNotifications.ts";
import { useNotificationFeedStore } from "../store/notificationFeed.store.ts";
import { useEffect } from "react";

export const useHydrateNotifications = () => {
  const { data } = useNotificationsQuery();
  const setItems = useNotificationFeedStore((s) => s.setItems);

  useEffect(() => {
    if (!data) {
      return;
    }
    setItems(data);
  }, [data, setItems]);
};
