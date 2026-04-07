import api from "./base/api";
import type { Stock, StockAdjustmentPayload } from "@/types/stock";

const getStocksByOutlet = async (outletId: string): Promise<Stock[]> => {
    const response = await api.get(`/stocks/outlet/${outletId}`);
    return response.data;
};

const getStocksByProduct = async (productId: string): Promise<Stock[]> => {
    const response = await api.get(`/stocks/product/${productId}`);
    return response.data;
};

const adjustStock = async (data: StockAdjustmentPayload): Promise<Stock> => {
    const response = await api.post("/stocks/adjust", data);
    return response.data;
};


export {
    getStocksByOutlet,
    getStocksByProduct,
    adjustStock
};
