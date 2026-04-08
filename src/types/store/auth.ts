import type { User, UserRole } from "../user";
import type { Outlet } from "../outlet";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
}

export interface AuthSlice {
    user: User | null;
    role: UserRole | null;
    outlet: Outlet | null;
    accessToken: string | null;
    isLoading: boolean;
    
    login: (credentials: LoginCredentials) => Promise<void>;
    setUser: (user: User | null) => void;
    setRole: (role: UserRole | null) => void;
    setOutlet: (outlet: Outlet | null) => void;
    setAccessToken: (token: string | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    logout: () => Promise<void>;
}