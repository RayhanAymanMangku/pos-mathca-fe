export interface Product {
    id: string;
    name: string;
    sku: string;
    basePrice: number;
    sellPrice: number;
    imageUrl: string;
    categoryId: string;
}

export interface UpdateProduct {
    name?: string;
    sku?: string;
    basePrice?: number;
    sellPrice?: number;
    imageUrl?: string;
    categoryId?: string;
}