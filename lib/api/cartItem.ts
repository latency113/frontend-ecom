import api from "./index";
import { CartItem } from "@/types/cart";

export const addCartItem = async (cartId: string, productId: string, quantity: number): Promise<CartItem> => {
  try {
    const response = await api.post(`/cartItems`, { cartId, productId, quantity });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const updateCartItem = async (cartItemId: string, quantity: number): Promise<CartItem> => {
  try {
    const response = await api.put(`/cartItems/${cartItemId}`, { quantity });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const deleteCartItem = async (cartItemId: string): Promise<void> => {
  try {
    await api.delete(`/cartItems/${cartItemId}`);
  }
  catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
