import api from "./base/api";
import type { Product, UpdateProduct } from "@/types/product";

const getAllProduct = async (): Promise<Product[]> => {
    const response = await api.get("/products/")
    return response.data;
}

const addProduct = async (product: Product): Promise<Product> => {
    const response = await api.post("/products/", product)
    return response.data;
}

const updateProduct = async (id: string, product: UpdateProduct): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product)
    return response.data;
}

const deleteProduct = async (id: string): Promise<Product> => {
    const response = await api.delete(`/products/${id}`)
    return response.data;
}

export {
    getAllProduct,
    addProduct,
    updateProduct,
    deleteProduct
}