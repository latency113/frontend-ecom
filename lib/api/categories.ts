import api from "./index";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get(`/categories`);
    return response.data.data;
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

export const getProductsByCategoryId = async (categoryId: string, page: number = 1, limit: number = 1000): Promise<Product[]> => {
    try {
      const response = await api.get(`/categories/${categoryId}/products?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message;
    }
  };

// Add other category-related API calls as needed (create, update, delete)
