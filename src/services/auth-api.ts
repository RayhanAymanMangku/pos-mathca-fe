import type { LoginCredentials, LoginResponse } from "@/types/store/auth";
import api from "./base/api";

const loginApi = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
};

export { loginApi };