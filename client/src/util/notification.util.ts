import { useNotificationStore } from "../store/notification.store";

export const notifySuccess = (message: string, duration?: number) => {
  useNotificationStore.getState().success(message, duration);
};

export const notifyError = (message: string, duration?: number) => {
  useNotificationStore.getState().error(message, duration);
};

export const clearNotification = () => {
  useNotificationStore.getState().clear();
};
