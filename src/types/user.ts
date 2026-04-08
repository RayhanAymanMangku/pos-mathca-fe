import type { Outlet } from "./outlet";

export type UserRole = "ADMIN" | "DRIVER";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone: string;
    outletId: string | null;
    outlet?: Outlet;
    latitude?: number;
    longitude?: number;
    locationUpdatedAt?: string;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserPayload {
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: UserRole;
    outletId: string;
}

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    password?: string;
    currentPassword?: string;
    phone?: string;
    role?: UserRole;
    outletId?: string;
}
