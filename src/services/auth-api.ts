import type { LoginCredentials, LoginResponse } from "@/types/store/auth";
import api from "./base/api";

const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // We use the raw axios instance or handle it in interceptor
    // but here we just call the endpoint.
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
};

const refreshTokenApi = async (): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/refresh-token");
    return response.data;
};

const logoutApi = async (): Promise<{ message: string }> => {
    const response = await api.post("/auth/logout");
    return response.data;
};

export { loginApi, refreshTokenApi, logoutApi };