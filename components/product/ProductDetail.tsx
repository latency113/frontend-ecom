"use client";

import { useUser } from "@/lib/context/UserContext";
import { useEffect, useState } from "react";
import { getProductById } from "@/lib/api/products";
import { Product } from "@/types/product";
import { Review } from "@/types/review";
import { getReviewsByProductId, createReview } from "@/lib/api/reviews";
import ReviewCard from "@/components/review/ReviewCard";
import { FaStar } from "react-icons/fa";
import { Minus, Plus, ShoppingCart, ZoomIn, X as CloseIcon } from "lucide-react";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  const { showToast } = useToast(); // Initialize useToast
  const router = useRouter(); // Initialize useRouter

  const isPromotionActive = () => {
    if (!product || !product.originalPrice || product.originalPrice <= product.price) return false;
    
    const now = new Date();
    const start = product.promotionStart ? new Date(product.promotionStart) : null;
    const end = product.promotionEnd ? new Date(product.promotionEnd) : null;

    if (start && now < start) return false;
    if (end && now > end) return false;
    
    return true;
  };

  const activePromotion = isPromotionActive();

  const fetchProductAndReviews = async () => {
    try {
      const productData = await getProductById(productId);
      setProduct(productData);
      setSelectedImage(productData.imgUrl || null);
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

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  const toggleLightbox = () => {
    setIsLightboxOpen(!isLightboxOpen);
    setZoomScale(1); // Reset zoom when opening/closing
  };

  const handleZoom = () => {
    setZoomScale(prev => prev === 1 ? 2 : 1);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(false);

    if (newReviewRating === 0 || !newReviewComment.trim()) {
      setReviewError("กรุณาให้คะแนนและระบุความคิดเห็น");
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
        { ...createdReview, user: { username: user?.username || "ไม่ประสงค์ออกนาม" } },
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
      showToast("กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าลงในตะกร้า", "info");
      router.push("/login");
      return;
    }
    if (!product) {
        showToast("ไม่พบข้อมูลสินค้า", "error");
        return;
    }
    if (selectedQuantity <= 0) {
        showToast("จำนวนสินค้าต้องอย่างน้อย 1 ชิ้น", "error");
        return;
    }
    if (product.stock !== undefined && selectedQuantity > product.stock) {
        showToast(`สินค้าในสต็อกไม่พอ เหลือเพียง ${product.stock} ชิ้น`, "error");
        return;
    }

    setAddToCartLoading(true);
    try {
      let userCart = await getCartByUserId(user.id);

      if (!userCart) {
        // If user doesn't have a cart, create one
        userCart = await createCart(user.id);
        showToast("สร้างตะกร้าสินค้าใหม่ให้คุณแล้ว!", "info");
      }

      await addCartItem(userCart.id, product.id, selectedQuantity); // Pass selectedQuantity
      showToast(`เพิ่ม ${product.name} จำนวน ${selectedQuantity} ชิ้น ลงในตะกร้าแล้ว!`, "success");

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
        กำลังโหลดรายละเอียดสินค้า...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 text-lg">
        เกิดข้อผิดพลาด: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        ไม่พบสินค้า
      </div>
    );
  }



  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/2 flex flex-col gap-4">
          <div 
            className="group relative flex items-center justify-center bg-gray-50 rounded-lg p-4 h-80 md:h-[500px] cursor-zoom-in overflow-hidden"
            onClick={toggleLightbox}
          >
            <img
              src={selectedImage || "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-contain rounded-md transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </div>
          </div>
          
          {/* Thumbnails */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              <div 
                className={`flex-shrink-0 w-20 h-20 border-2 rounded-md cursor-pointer overflow-hidden transition-all ${selectedImage === product.imgUrl ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-300'}`}
                onClick={() => setSelectedImage(product.imgUrl || null)}
              >
                <img src={product.imgUrl} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {product.images.map((img) => (
                <div 
                  key={img.id}
                  className={`flex-shrink-0 w-20 h-20 border-2 rounded-md cursor-pointer overflow-hidden transition-all ${selectedImage === img.url ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-300'}`}
                  onClick={() => setSelectedImage(img.url)}
                >
                  <img src={img.url} alt={product.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-all animate-in fade-in duration-300">
            <button 
              onClick={toggleLightbox}
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-50 bg-black/50 p-2 rounded-full"
            >
              <CloseIcon className="w-8 h-8" />
            </button>
            
            <div 
              className="relative w-full h-full flex items-center justify-center p-4 md:p-12 overflow-hidden cursor-zoom-out"
              onClick={(e) => {
                if (e.target === e.currentTarget) toggleLightbox();
              }}
            >
              <div 
                className="relative flex items-center justify-center transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoomScale})` }}
              >
                <img
                  src={selectedImage || "/placeholder.png"}
                  alt={product.name}
                  className={`max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-all ${zoomScale > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoom();
                  }}
                />
              </div>
              
              {zoomScale === 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/40 px-4 py-2 rounded-full pointer-events-none">
                  คลิกที่รูปเพื่อซูม
                </div>
              )}
            </div>
          </div>
        )}

        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
            {product.name}
          </h1>
          <div className="prose prose-sm text-gray-700 leading-relaxed mb-6">
            <span className="font-semibold block mb-2">รายละเอียดสินค้า:</span>
            {product.description}
          </div>
          
          <div className="flex flex-col mb-6">
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-blue-600">
                {(activePromotion ? product.price : (product.originalPrice || product.price)).toLocaleString("th-TH", {
                  currency: "thb",
                  style: "currency",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              {activePromotion && (
                <div className="flex items-center gap-2">
                  <p className="text-xl text-gray-400 line-through">
                    {product.originalPrice!.toLocaleString("th-TH", {
                      currency: "thb",
                      style: "currency",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ลด {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                  </span>
                </div>
              )}
            </div>
            {activePromotion && product.promotionEnd && (
              <p className="text-xs text-red-500 mt-2 font-medium">
                * โปรโมชั่นสิ้นสุดวันที่ {new Date(product.promotionEnd).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
         

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6"> {/* New div for quantity selector and button */}
            {/* Quantity Selector UI */}
            <div className="flex items-center border border-gray-300 rounded-md bg-white">
              <button
                onClick={() => handleQuantityChange('decrement')}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-l-md disabled:opacity-50"
                disabled={selectedQuantity <= 1 || addToCartLoading}
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="text" // Change to text as it's read-only
                readOnly
                value={selectedQuantity}
                className="w-12 p-2 text-center border-l border-r border-gray-300 outline-none text-gray-900 font-medium"
              />
              <button
                onClick={() => handleQuantityChange('increment')}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-r-md disabled:opacity-50"
                disabled={selectedQuantity >= (product.stock || 0) || addToCartLoading}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {/* End Quantity Selector UI */}
            
            <button
              onClick={handleAddToCart}
              disabled={addToCartLoading || product.stock === 0 || selectedQuantity === 0} // Disable if adding, out of stock, or quantity is 0
              className="w-full sm:w-auto bg-blue-600 text-white py-3 px-8 border border-transparent rounded-md shadow-lg text-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                <ShoppingCart className="w-5 h-5" /> {addToCartLoading ? "Adding..." : "เพิ่มลงตะกร้า"}
            </button>
          </div>
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
          {!user ? (
            <p className="text-gray-600 bg-gray-50 p-4 rounded-md border border-gray-200">
              กรุณา <Link href="/login" className="text-blue-600 hover:underline font-semibold">เข้าสู่ระบบ</Link> เพื่อแบ่งปันความคิดเห็นของคุณเกี่ยวกับสินค้านี้
            </p>
          ) : reviews.some((r) => r.userId === user.id) ? (
            <p className="text-green-700 bg-green-50 p-4 rounded-md border border-green-200 flex items-center gap-2">
              <FaStar className="text-green-600" /> คุณได้รีวิวสินค้านี้ไปแล้ว ขอบคุณสำหรับความคิดเห็นของคุณ!
            </p>
          ) : (
            <>
              {reviewError && (
                <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded border border-red-100">{reviewError}</p>
              )}
              {reviewSuccess && (
                <p className="text-green-600 text-sm mb-4 bg-green-50 p-3 rounded border border-green-100">
                  ส่งรีวิวสำเร็จแล้ว!
                </p>
              )}
              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    คะแนน:
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
                    ความคิดเห็น:
                  </label>
                  <textarea
                    id="reviewComment"
                    rows={4}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="แบ่งปันความประทับใจของคุณเกี่ยวกับสินค้านี้..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-5 border border-transparent rounded-md shadow-sm text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                  disabled={reviewLoading}
                >
                  {reviewLoading ? "กำลังส่ง..." : "ส่งรีวิว"}
                </button>
              </form>
            </>
          )}
        </div>

        {!reviews || reviews.length === 0 ? (
          <p className="text-center py-10 text-gray-600 text-lg">
            ยังไม่มีรีวิวสำหรับสินค้านี้ เป็นคนแรกที่ให้รีวิวเลย!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <ReviewCard key={review.id || index} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
