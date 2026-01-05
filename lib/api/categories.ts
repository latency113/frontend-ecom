import api from "./index";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get(`/categories`);
    console.log("getAllCategories API response:", response.data); // Debugging line
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

export const getProductsByCategoryId = async (categoryId: string): Promise<Product[]> => {
    try {
      const response = await api.get(`/categories/${categoryId}/products`);
      console.log("getProductsByCategoryId API response:", response.data); // Debugging line
      return response.data.data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message;
    }
  };

// Add other category-related API calls as needed (create, update, delete)
