import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { store } from "@/store/store";
import { logout, refreshToken } from "@/features/auth/authSlice";

let isRefreshing = false;
let failedQueue: Array<(token: string) => void> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((cb) => {
    if (error) {
      cb("");
    } else {
      cb(token!);
    }
  });
  failedQueue = [];
};

export const makeRequest: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

makeRequest.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

makeRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push((newToken: string) => {
            if (!newToken) {
              reject("Refresh failed");
              return;
            }
            originalReq.headers!["Authorization"] = `Bearer ${newToken}`;
            resolve(makeRequest(originalReq));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newToken = data.accessToken;

        // ✅ Update Redux state with proper action
        store.dispatch(
          refreshToken({
            user: data.user,
            accessToken: newToken,
          })
        );

        processQueue(null, newToken);
        originalReq.headers!["Authorization"] = `Bearer ${newToken}`;
        return makeRequest(originalReq);
      } catch (err) {
        processQueue(err as Error, null);

        // ✅ Proper logout with Redux action
        store.dispatch(logout());

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
