export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
  updatedAt: string;
  userName?: string; // Optional, if you want to display user's name with review
}
