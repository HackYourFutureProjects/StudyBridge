import axios from "axios";
import { useAuthSessionStore } from "../store/authSession.store";
import { triggerLogout } from "./auth/logoutBus";
import { refreshApi } from "./auth/auth.api";
type QueueItem = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};
export const apiPublic = axios.create({
  baseURL: "",
  withCredentials: false,
});

export const apiProtected = axios.create({
  baseURL: "",
  withCredentials: true,
});

apiProtected.interceptors.request.use((config) => {
  const token = useAuthSessionStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiProtected.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error?.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (String(originalRequest.url).includes("/auth/refresh-token")) {
      useAuthSessionStore.getState().clearSession();
      triggerLogout();
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${String(token)}`;
          return apiProtected(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { accessToken: newAccessToken } = await refreshApi();

        useAuthSessionStore.getState().setAccessToken(newAccessToken);

        apiProtected.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiProtected(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthSessionStore.getState().clearSession();
        triggerLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
