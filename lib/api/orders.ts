import api from "./index";
import { Order, OrderItem } from "@/types/order";

export const createOrder = async (
  userId: string, 
  cartItems: { productId: string; quantity: number; price: number }[], 
  addressId: string,
  paymentMethod: string = "COD",
  paymentSlip?: string | null
): Promise<Order> => {
  try {
    const response = await api.post(`/orders`, { 
      cartItems: cartItems ?? [], 
      addressId,
      paymentMethod,
      paymentSlip
    });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const uploadSlip = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("imgUrl", file);
  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.imageUrl;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data;
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

    throw new Error(error.response?.data?.message || error.message || "Unknown error");
  }
};

// You can add more functions for updating order status, getting order history etc.
