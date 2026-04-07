import api from "./base/api";
import type { CreateUserPayload, UpdateUserPayload, User } from "@/types/user";

const getAllUsers = async (): Promise<User[]> => {
    const response = await api.get("/users/");
    return response.data;
};

const createUser = async (data: CreateUserPayload): Promise<User> => {
    const response = await api.post("/users/", data);
    return response.data;
};

const getUserById = async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

const updateUser = async (id: string, data: UpdateUserPayload): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
};

const deleteUser = async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
};


const updateLocation = async (latitude: number, longitude: number): Promise<void> => {
    await api.patch("/users/location", { latitude, longitude });
};


const getDriverLocations = async (): Promise<User[]> => {
    const response = await api.get("/users/locations");
    return response.data;
};

export {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    updateLocation,
    getDriverLocations
};
