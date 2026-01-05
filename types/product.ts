export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imgUrl?: string; // Make imgUrl optional
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imgUrl?: string; // Optional for creation, as it might be uploaded separately
}
