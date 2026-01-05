"use client";

import { useUser } from "@/lib/context/UserContext";
import { useEffect, useState } from "react";
import { getProductById } from "@/lib/api/products";
import { Product } from "@/types/product";
import { Review } from "@/types/review";
import { getReviewsByProductId, createReview } from "@/lib/api/reviews";
import ReviewCard from "@/components/review/ReviewCard";
import { FaStar } from "react-icons/fa";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useRouter } from "next/navigation";
import { getCartByUserId, createCart } from "@/lib/api/cart";
import { addCartItem } from "@/lib/api/cartItem";

interface ProductDetailProps {
  productId: string;
}

const ProductDetail = ({ productId }: ProductDetailProps) => {
  const { user } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false); // New state for add to cart loading
  const [selectedQuantity, setSelectedQuantity] = useState(1); // New state for quantity

  const { showToast } = useToast(); // Initialize useToast
  const router = useRouter(); // Initialize useRouter

  const fetchProductAndReviews = async () => {
    try {
      const productData = await getProductById(productId);
      setProduct(productData);
      const reviewsData = await getReviewsByProductId(productId);
      setReviews(reviewsData);
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(false);

    if (newReviewRating === 0 || !newReviewComment.trim()) {
      setReviewError("Please provide a rating and a comment.");
      setReviewLoading(false);
      return;
    }

    try {
      const createdReview = await createReview(
        productId,
        user?.id || "anonymous", // Assuming "anonymous" as a placeholder if userId is not available
        newReviewRating,
        newReviewComment
      );
      // Add the new review to the list, including the dummy user name for display
      setReviews((prevReviews) => [
        { ...createdReview, userName: user?.username || "Anonymous" },
        ...prevReviews,
      ]);
      setNewReviewRating(0);
      setNewReviewComment("");
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000); // Clear success message after 3 seconds
    } catch (err: any) {
      setReviewError(err.toString());
      console.error("Error submitting review:", err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      showToast("Please log in to add items to your cart.", "info");
      router.push("/login");
      return;
    }
    if (!product) {
        showToast("Product data is not available.", "error");
        return;
    }
    if (selectedQuantity <= 0) {
        showToast("Quantity must be at least 1.", "error");
        return;
    }
    if (product.stock !== undefined && selectedQuantity > product.stock) {
        showToast(`Not enough stock. Only ${product.stock} left.`, "error");
        return;
    }

    setAddToCartLoading(true);
    try {
      let userCart = await getCartByUserId(user.id);

      if (!userCart) {
        // If user doesn't have a cart, create one
        userCart = await createCart(user.id);
        showToast("New cart created for you!", "info");
      }

      await addCartItem(userCart.id, product.id, selectedQuantity); // Pass selectedQuantity
      showToast(`${selectedQuantity} x ${product.name} added to cart!`, "success");

      // Dispatch a custom event to notify other components (e.g., Header) to update cart count
      window.dispatchEvent(new Event('cartUpdated'));

    } catch (err: any) {
      showToast(`Error adding to cart: ${err.message || err.toString()}`, "error");
      console.error("Error adding to cart:", err);
    } finally {
      setAddToCartLoading(false);
    }
  };

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (!product) return;

    if (type === 'increment') {
      setSelectedQuantity((prev) => Math.min(prev + 1, product.stock || 0));
    } else {
      setSelectedQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 text-lg">
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Product not found.
      </div>
    );
  }



  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8 mb-12 p-8">
        <div className="md:w-1/2 flex items-center justify-center">
          <img
            src={product.imgUrl}
            alt={product.name}
            className="w-full h-96 object-contain rounded-md shadow-lg border border-gray-200 p-4"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">
            {product.name}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mt-2">
            รายละเอียดสินค้า:
            <span className="flex">{product.description}</span>
          </p>
          <hr className="my-6" />
          <p className="text-xl font-bold text-blue-600 mb-4"> {/* Changed mb-6 to mb-4 to make space for quantity selector */}
            {product.price.toLocaleString("th-TH", {
              currency: "thb",
              style: "currency",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>

          <div className="flex items-center gap-4 mb-6"> {/* New div for quantity selector and button */}
            {/* Quantity Selector UI */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange('decrement')}
                className="p-2 disabled:opacity-50 text-gray-600 hover:text-gray-900"
                disabled={selectedQuantity <= 1 || addToCartLoading}
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="text" // Change to text as it's read-only
                readOnly
                value={selectedQuantity}
                className="w-12 p-2 text-center border-l border-r border-gray-300 outline-none"
              />
              <button
                onClick={() => handleQuantityChange('increment')}
                className="p-2 disabled:opacity-50 text-gray-600 hover:text-gray-900"
                disabled={selectedQuantity >= (product.stock || 0) || addToCartLoading}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {/* End Quantity Selector UI */}
            
            <button
              onClick={handleAddToCart}
              disabled={addToCartLoading || product.stock === 0 || selectedQuantity === 0} // Disable if adding, out of stock, or quantity is 0
              className="bg-blue-600 text-white py-2 px-4 border border-transparent rounded-md shadow-lg text-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
            >
              <p className="flex">
                <ShoppingCart className="inline mr-2" /> {addToCartLoading ? "Adding..." : "เพิ่มลงตะกร้า"}
              </p>
            </button>
          </div>
          {product.stock === 0 && (
            <p className="text-red-500 text-sm mt-2">สินค้าหมด</p>
          )}
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
          รีวิวสินค้า
        </h2>

        <div className="mb-10 p-8 bg-white rounded-lg shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-5">
            เขียนรีวิวของคุณ
          </h3>
          {reviewError && (
            <p className="text-red-600 text-sm mb-4">{reviewError}</p>
          )}
          {reviewSuccess && (
            <p className="text-green-600 text-sm mb-4">
              Review submitted successfully!
            </p>
          )}
          <form onSubmit={handleSubmitReview} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating:
              </label>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`cursor-pointer text-3xl ${
                      i < newReviewRating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400 transition-colors`}
                    onClick={() => setNewReviewRating(i + 1)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="reviewComment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Comment:
              </label>
              <textarea
                id="reviewComment"
                rows={4}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-5 border border-transparent rounded-md shadow-sm text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              disabled={reviewLoading}
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>

        {reviews.length === 0 ? (
          <p className="text-center py-10 text-gray-600 text-lg">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
