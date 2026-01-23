export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null; // Added for promotion
  promotionStart?: string | null;
  promotionEnd?: string | null;
  stock: number;
  imgUrl?: string; // Make imgUrl optional
  images?: { id: string; url: string; productId: string; createdAt: string }[];
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Added for promotion
  promotionStart?: string | null;
  promotionEnd?: string | null;
  stock: number;
  categoryId: string;
  imgUrl?: string; // Optional for creation, as it might be uploaded separately
}
