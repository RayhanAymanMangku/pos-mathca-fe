import type { Outlet } from "@/types/outlet";
import type { OutletFormValues } from "@/features/dashboard/validators/outlet-schema";
import api from "./base/api"
import type { Transaction } from "@/types/transaction";

const getOutlets = async (): Promise<Outlet[]> => {
    const response = await api.get("/outlets/")
    return response.data;
}

const getOutletTransactions = async (id: string): Promise<Transaction[]> => {
    const response = await api.get(`/outlets/${id}/transactions/`)
    return response.data;
}

const getOutletById = async (id: string): Promise<Outlet> => {
    const response = await api.get(`/outlets/${id}/`)
    return response.data;
}

const addOutlet = async (data: OutletFormValues): Promise<Outlet> => {
    const response = await api.post("/outlets/", data)
    return response.data;
}

const updateOutlet = async (id: string, data: OutletFormValues): Promise<Outlet> => {
    const response = await api.put(`/outlets/${id}/`, data)
    return response.data;
}

const deleteOutlet = async (id: string): Promise<void> => {
    await api.delete(`/outlets/${id}/`)
}

export {
    getOutlets,
    getOutletById,
    getOutletTransactions,
    addOutlet,
    updateOutlet,
    deleteOutlet
}