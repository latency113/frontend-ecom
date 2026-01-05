import api from "./index";
import { Cart } from "@/types/cart";
import { CartItem } from "@/types/cart";

export const getCartByUserId = async (userId: string): Promise<Cart | null> => {
  try {
    const response = await api.get(`/carts/user/${userId}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error.response?.data?.message || error.message;
  }
};

export const createCart = async (userId: string): Promise<Cart> => {
    try {
      const response = await api.post(`/carts`, { userId });
      return response.data.data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message;
    }
  };

export const updateCart = async (cartId: string, payload: Partial<Cart>): Promise<Cart> => {
  try {
    const response = await api.put(`/carts/${cartId}`, payload);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const deleteCart = async (cartId: string): Promise<void> => {
  try {
    await api.delete(`/carts/${cartId}`);
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const clearCart = async (cartId: string): Promise<void> => {
  try {
    await api.delete(`/carts/${cartId}/items`);
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
