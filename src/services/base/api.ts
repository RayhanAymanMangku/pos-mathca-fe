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

// Request interceptor to add the access token to the headers
api.interceptors.request.use(
    (config) => {
        const isAuthRoute = config.url?.includes('/auth/login');
        
        if (isAuthRoute) {
            return config;
        }

        const accessToken = useStore.getState().accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
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
        // Handle common API response format where data is wrapped in 'data' field
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
            const meta = (response.data as any).meta;
            
            return {
                ...response,
                data: response.data.data,
                ...(meta ? { meta } : {}),
            } as any;
        }
        return response;
    },

    async (error: AxiosError<ApiResponse<unknown>>) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const apiMessage = error.response?.data?.message;

        // Handle 401 Unauthorized errors
        if (status === 401 && originalRequest && !(originalRequest as any)._retry) {
            // Don't attempt to refresh token if the error is from a login request
            if (originalRequest.url?.includes('/auth/login')) {
                return Promise.reject(error);
            }

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
                // Use a separate axios instance for refresh token to avoid interceptor conflict
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {}, { withCredentials: true });
                const { accessToken } = response.data.data;

                useStore.getState().setAccessToken(accessToken);
                processQueue(null, accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                await useStore.getState().logout();
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
                return Promise.reject(new Error('Session expired. Please login again.'));
            } finally {
                isRefreshing = false;
            }
        }

        // Handle other common error status codes
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
