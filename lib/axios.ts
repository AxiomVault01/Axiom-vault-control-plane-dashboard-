import axios, { AxiosError } from "axios";

export const TOKEN_KEY = "accessToken";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/* ---------- Request: attach auth token ---------- */

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------- Response: handle auth errors and normalize messages ---------- */

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.message ??
      (error.code === "ECONNABORTED"
        ? "Request timed out. Please try again."
        : error.message || "Something went wrong");

    return Promise.reject(new Error(message, { cause: error }));
  },
);

export default api;
