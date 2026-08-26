import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

let onRequestStart: (() => void) | null = null;
let onRequestEnd: (() => void) | null = null;

export const registerLoadingHandlers = (start: () => void, end: () => void) => {
  onRequestStart = start;
  onRequestEnd = end;
};

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  onRequestStart?.();
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    onRequestEnd?.();
    return response;
  },
  (error) => {
    onRequestEnd?.();
    return Promise.reject(error);
  },
);

export default axiosInstance;
