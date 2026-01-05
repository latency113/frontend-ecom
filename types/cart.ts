import { Product } from "./product";

export interface CartItem {
  id: string;
  productId: string;
  product: Product; // Assuming product details are embedded or can be fetched
  cartId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  cartItems: CartItem[];
  createdAt: string;
  updatedAt: string;
}
