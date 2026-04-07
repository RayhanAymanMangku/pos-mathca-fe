import type { Product } from "./product";
import type { Outlet } from "./outlet";

export interface Stock {
    id: string;
    productId: string;
    outletId: string;
    quantity: number;
    product?: Product;
    outlet?: Outlet;
    createdAt?: string;
    updatedAt?: string;
}

export type StockAdjustmentMode = 'ADD' | 'SUBTRACT' | 'SET';

export interface StockAdjustmentPayload {
    productId: string;
    outletId: string;
    quantity: number;
    mode: StockAdjustmentMode;
}
