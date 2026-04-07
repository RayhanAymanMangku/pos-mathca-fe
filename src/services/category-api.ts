import api from "./base/api";

export interface Category {
    id: string
    name: string
}

const getAllCategories = async (): Promise<Category[]> => {
    const response = await api.get("/categories/")
    return response.data;
}

const addCategory = async (category: Category): Promise<Category> => {
    const response = await api.post("/categories/", category)
    return response.data;
}

const updateCategory = async (id: string, category: Category): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, category)
    return response.data;
}

const deleteCategory = async (id: string): Promise<Category> => {
    const response = await api.delete(`/categories/${id}`)
    return response.data;
}

export {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
}