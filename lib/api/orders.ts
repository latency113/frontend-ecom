import api from "./index";
import { Order, OrderItem } from "@/types/order";

export const createOrder = async (userId: string, cartItems: { productId: string; quantity: number; price: number }[], address: string): Promise<Order> => {
  try {
    // userId is already passed via authentication, so remove it from the body payload
    const response = await api.post(`/orders`, { cartItems: cartItems ?? [], address });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const getAllOrders = async (userId: string): Promise<Order[]> => {
    try {
      const response = await api.get(`/orders/user/${userId}`);
      return response.data.data; // Corrected to access the actual data array
    } catch (error: any) {
      throw error.response?.data?.message || error.message;
    }
  };

export const cancelOrder = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.patch(`/orders/${orderId}`, { status: "CANCELLED" });
    return response.data.data;
  } catch (error: any) {

    throw error.response?.data?.message || error.message || "Unknown error";
  }
};

// You can add more functions for updating order status, getting order history etc.
