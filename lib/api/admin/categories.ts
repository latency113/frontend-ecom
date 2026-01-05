// Placeholder for admin category API calls
import { Category } from "@/types/category";

import api from "../index";

export const getAllCategories = async (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = ""
): Promise<{
  data: Category[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}> => {
  try {
    const response = await api.get("/categories", {
      params: { page, limit, searchTerm },
    });
    return response.data; // Assuming backend returns { data: [], totalCount: N, ... }
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const createCategory = async (categoryData: Omit<Category, "id">): Promise<Category> => {
  try {
    const response = await api.post("/categories", categoryData);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category> => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

