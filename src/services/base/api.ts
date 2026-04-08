import { useStore } from '@/store/store';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@/types/api';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10_000,
});

api.interceptors.request.use(
    (config) => {
        const token = useStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
            const meta = (response.data as any).meta;
            
            return {
                ...response,
                data: response.data.data,
                ...(meta ? { meta } : {}), // Append meta to the AxiosResponse object
            };
        }
        return response;
    },

    async (error: AxiosError<ApiResponse<unknown>>) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const apiMessage = error.response?.data?.message;

        if (status === 401 && originalRequest && !(originalRequest as any)._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            (originalRequest as any)._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
                const { accessToken } = response.data.data;

                useStore.getState().setToken(accessToken);
                processQueue(null, accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                useStore.getState().logout();
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
                return Promise.reject(new Error('Session expired. Please login again.'));
            } finally {
                isRefreshing = false;
            }
        }

        if (status === 403) {
            return Promise.reject(new Error(apiMessage ?? 'You do not have permission to access this resource.'));
        }

        if (status === 422) {
            return Promise.reject(new Error(apiMessage ?? 'Validation error. Please check your input.'));
        }

        if (status && status >= 500) {
            return Promise.reject(new Error(apiMessage ?? 'Server error. Please try again later.'));
        }

        if (!error.response) {
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        return Promise.reject(new Error(apiMessage ?? 'An unexpected error occurred.'));
    }
);

export default api;
