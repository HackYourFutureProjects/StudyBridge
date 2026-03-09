import { apiProtected } from "../api.ts";

export const getMyNotifications = async () => {
  const response = await apiProtected.get("/api/notifications");
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  await apiProtected.patch("/api/notifications/read-all");
};

export const markNotificationAsRead = async (id: string) => {
  await apiProtected.patch(`/api/notifications/${id}/read`);
};

export const deleteAllReadNotifications = async () => {
  await apiProtected.delete("/api/notifications/read-all");
};
