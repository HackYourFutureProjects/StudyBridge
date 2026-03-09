import { useQuery } from "@tanstack/react-query";
import { getMyNotifications } from "../../../api/notifications/notifications.api.ts";
import { useEffect } from "react";
import { getErrorMessage } from "../../../util/ErrorUtil.ts";
import { useNotificationStore } from "../../../store/notification.store.ts";
import { useAuthSessionStore } from "../../../store/authSession.store.ts";
import { notificationKeys } from "../../queryKeys.ts";

export const useNotificationsQuery = () => {
  const notifyError = useNotificationStore((s) => s.error);
  const accessToken = useAuthSessionStore((s) => s.accessToken);
  const userId = useAuthSessionStore((s) => s.user?.id);
  const query = useQuery({
    queryKey: notificationKeys.root,
    queryFn: getMyNotifications,
    enabled: !!accessToken && !!userId,
    retry: false,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (query.isError) {
      const msg = getErrorMessage(query.error);
      notifyError(msg ?? "Failed to load notifications");
    }
  }, [query.isError, query.error, notifyError]);

  return query;
};
