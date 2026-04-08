import type { LoginCredentials, LoginResponse } from "@/types/store/auth";
import api from "./base/api";

const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
};

const logout = async (): Promise<{ message: string }> => {
    const response = await api.post("/auth/logout");
    return response.data;
}

export { loginApi, logout };