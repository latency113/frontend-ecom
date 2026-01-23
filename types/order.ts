import { Address } from "./address";
import { Product } from "./product";
import { User } from "./user"; // Import User type

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  orderId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user: User; // Add user object
  items: OrderItem[];
  totalAmount: number;
  address: string;
  paymentMethod: string;
  paymentSlip?: string | null;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}
