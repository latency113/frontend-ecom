import api from "./index";
import { Review } from "@/types/review";

export const getReviewsByProductId = async (productId: string): Promise<Review[]> => {
  try {
    const response = await api.get(`/products/${productId}/reviews`);
    console.log("getReviewsByProductId API response:", response.data); // Debugging line
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const createReview = async (productId: string, userId: string, rating: number, comment: string): Promise<Review> => {
  try {
    const response = await api.post(`/reviews`, { productId, userId, rating, comment });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

// Add update and delete review functions if needed
