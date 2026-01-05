// Placeholder for admin product API calls
import { Product } from "@/types/product";

import api from "../index";

export const getAllProducts = async (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = "",
  categoryId: string | null = null
): Promise<{
  data: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}> => {
  try {
    const params: any = { page, limit };
    if (searchTerm) params.searchTerm = searchTerm;
    if (categoryId) params.categoryId = categoryId;

    const response = await api.get("/products", { params });
    return response.data; // Assuming backend returns { data: [], totalCount: N, ... }
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const createProduct = async (productData: FormData): Promise<Product> => {
  try {
    const response = await api.post("/products", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const updateProduct = async (id: string, productData: FormData): Promise<Product> => {
  try {
    const response = await api.put(`/products/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
