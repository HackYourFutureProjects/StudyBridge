import axios from "axios";
import { useAuthSessionStore } from "../store/authSession.store";

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
