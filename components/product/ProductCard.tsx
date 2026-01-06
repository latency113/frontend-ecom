import Link from "next/link";
import { Product } from "@/types/product";
import { ShoppingCart } from "lucide-react"; // Import ShoppingCart icon
import { useToast } from "@/components/ui/Toast/ToastProvider"; // Import useToast
import { useRouter } from "next/navigation"; // Import useRouter
import { useUser } from "@/lib/context/UserContext"; // Import useUser
import { getCartByUserId, createCart } from "@/lib/api/cart"; // Import cart API functions
import { addCartItem } from "@/lib/api/cartItem"; // Import cartItem API function
import { useState } from "react"; // Import useState

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useUser();
  const router = useRouter();
  const { showToast } = useToast();
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default link navigation
    event.stopPropagation(); // Stop event propagation to the parent Link

    if (!user) {
      showToast("Please log in to add items to your cart.", "info");
      router.push("/login");
      return;
    }
    if (!product) {
        showToast("Product data is not available.", "error");
        return;
    }
    if (product.stock <= 0) {
        showToast("Product is out of stock.", "error");
        return;
    }

    setAddToCartLoading(true);
    try {
      let userCart = await getCartByUserId(user.id);

      if (!userCart) {
        userCart = await createCart(user.id);
        showToast("New cart created for you!", "info");
      }

      await addCartItem(userCart.id, product.id, 1); // Add 1 quantity by default from card
      showToast(`${product.name} เพิ่มลงตะกร้า!`, "success");

      window.dispatchEvent(new Event('cartUpdated'));

    } catch (err: any) {
      showToast(`Error adding to cart: ${err.message || err.toString()}`, "error");
      console.error("Error adding to cart from card:", err);
    } finally {
      setAddToCartLoading(false);
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-5 hover:shadow-md transition-all duration-300 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-md bg-gray-50">
          {product.imgUrl ? (
            <img
              src={product.imgUrl}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-grow">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 line-clamp-2 h-10 sm:h-12">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2 h-8 sm:h-10">
            {product.description}
          </p>
          
          <div className="mt-auto">
            <p className="text-base sm:text-lg font-bold text-blue-600 mb-3">
              {product.price.toLocaleString("th-TH", {
                currency: "thb",
                style: "currency",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>

            {product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={addToCartLoading}
                className="w-full bg-blue-600 text-white py-1.5 sm:py-2 px-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-1 sm:gap-2"
              >
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 h-4" />
                <span className="truncate">
                  {addToCartLoading ? "Adding..." : "เพิ่มลงตะกร้า"}
                </span>
              </button>
            ) : (
              <p className="text-red-500 text-xs sm:text-sm font-medium text-center py-1.5 sm:py-2 px-2 border border-red-200 bg-red-50 rounded-md">
                สินค้าหมด
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
