import api from "./base/api";
import type { Transaction, CreateTransactionPayload, MyTransactionResponse } from "@/types/transaction";

const createTransaction = async (data: CreateTransactionPayload): Promise<Transaction> => {
    const response = await api.post("/transactions", data);
    return response.data;
};

const getTransactions = async (outletId?: string): Promise<Transaction[]> => {
    const params = outletId ? { outletId } : {};
    const response = await api.get("/transactions", { params });
    return response.data;
};

const getMyTransactions = async (params: { 
    page?: number; 
    limit?: number;
    startDate?: string;
    endDate?: string;
}): Promise<MyTransactionResponse> => {
    const response = await api.get("/transactions/me", { params });
    return {
        status: "success",
        data: response.data as any,
        meta: (response as any).meta
    };
};

export {
    createTransaction,
    getTransactions,
    getMyTransactions
};
