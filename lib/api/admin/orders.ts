// Placeholder for admin order API calls
import { Order } from "@/types/order";

import api from "../index";

export const getAllOrders = async (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = "",
  statusFilter: string = "all"
): Promise<{
  data: Order[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}> => {
  try {
    const params: any = { page, limit };
    if (searchTerm) params.searchTerm = searchTerm;
    if (statusFilter !== "all") params.statusFilter = statusFilter;

    const response = await api.get("/orders", { params });
    return response.data; // Assuming backend returns { data: [], totalCount: N, ... }
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  try {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
