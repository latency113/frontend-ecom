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
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="w-full h-48 mb-4 overflow-hidden rounded-md">
          {product.imgUrl ? (
            <img
              src={product.imgUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
              No Image
            </div>
          )}
        </div>
        <h3 className="text-md font-semibold text-gray-800 mb-1 h-12 overflow-hidden">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 h-10 overflow-hidden mb-2">
          {product.description.length > 60
            ? product.description.slice(0, 60) + "..."
            : product.description}
        </p>
        <p className="text-lg font-bold text-blue-600 mb-4"> {/* Adjusted margin-bottom */}
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {addToCartLoading ? "Adding..." : "เพิ่มลงตะกร้า"}
          </button>
        ) : (
          <p className="text-red-500 text-sm font-medium text-center py-2 px-4 border border-red-300 bg-red-50 rounded-md">
            สินค้าหมด
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
