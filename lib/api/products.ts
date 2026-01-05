import api from "./index";
import { Product } from "@/types/product";

export const getAllProducts = async (page: number = 1, limit: number = 100): Promise<Product[]> => {
  try {
    const response = await api.get(`/products?page=${page}&limit=${limit}`);
    console.log("getAllProducts API response:", response.data); // Debugging line
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get(`/products/${id}`);
    console.log("getProductById API response:", response.data); // Debugging line
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

// Add other product-related API calls as needed (create, update, delete)

