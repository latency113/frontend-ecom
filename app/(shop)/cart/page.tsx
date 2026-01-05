"use client";

import { useEffect, useState } from "react";
import { Cart, CartItem as ICartItem } from "@/types/cart";
import { getCartByUserId, updateCart } from "@/lib/api/cart";
import { updateCartItem, deleteCartItem } from "@/lib/api/cartItem";
import CartItem from "@/components/cart/CartItem";
import Link from "next/link";
import { useUser } from "@/lib/context/UserContext"; // Import useUser
import { LogIn, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/Toast/ToastProvider"; // Import useToast

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [errorCart, setErrorCart] = useState<string | null>(null);

  const { user, loading: loadingUser, error: userError } = useUser(); // Get user from context
  const { showToast } = useToast(); // Initialize useToast

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) {
        setLoadingCart(false);
        return;
      }
      try {
        setLoadingCart(true);
        const data = await getCartByUserId(user.id); // Use user.id
        setCart(data);
      } catch (err: any) {
        setErrorCart(err.toString());
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, [user?.id]); // Re-fetch when user.id changes

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (!user?.id) {
      setErrorCart("User not authenticated.");
      return;
    }
    try {
      await updateCartItem(itemId, newQuantity);
      if (cart) {
        setCart({
          ...cart,
          cartItems: cart.cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          ),
        });
      }
    } catch (err: any) {
      console.error("Error updating cart item quantity:", err);
      setErrorCart(err.toString());
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!user?.id) {
      setErrorCart("User not authenticated.");
      return;
    }
    try {
      await deleteCartItem(itemId);
      if (cart) {
        setCart({
          ...cart,
          cartItems: cart.cartItems.filter((item) => item.id !== itemId),
        });
      }
      showToast("ลบสินค้าออกจากตะกร้าเสร็จสิน !", "success");
    } catch (err: any) {
      console.error("Error removing cart item:", err);
      setErrorCart(err.toString());
      showToast(
        `Error removing cart item: ${err.message || err.toString()}`,
        "error"
      ); // Error toast
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.cartItems) return 0;
    return cart.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
  };

  if (loadingUser || loadingCart) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading cart...
      </div>
    );
  }

  if (userError || errorCart) {
    return (
      <div className="text-center py-20 text-red-500 text-lg">
        Error: {userError || errorCart}
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-700 mb-6">
          เข้าสู่ระบบเพื่อดูตะกร้าสินค้าของคุณ
        </p>
        <Link
          href="/login"
          className="inline-flex items-center px-4 py-3 gap-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue -700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue -500"
        >
          <LogIn />
          เข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-700 mb-6">ตะกร้าสินค้าของคุณว่างอยู่</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ShoppingCart /> เลือกสินค้าเลย
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-10 tracking-tight">
        ตะกร้าสินค้าของคุณ ({cart.cartItems.length})
      </h1>
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3 space-y-4">
          {cart.cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          ))}
        </div>
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-100 mt-8 lg:mt-0 sticky top-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            สรุปคำสั่งซื้อ
          </h2>
          <div className="flex justify-between text-base text-gray-700 mb-2">
            <span>ยอดทั้งหมด:</span>
            <span>
              {calculateTotal().toLocaleString("th-TH", {
                style: "currency",
                currency: "thb",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}{" "}
              บาท
            </span>
          </div>
          <div className="flex justify-between text-xl font-semibold text-gray-900 border-t pt-4 mt-4">
            <span>สรุปยอดทั้งหมด:</span>
            <span>
              {calculateTotal().toLocaleString("th-TH", {
                style: "currency",
                currency: "thb",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
          <Link href="/checkout">
            <button className="w-full bg-blue-600 text-white py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring--500 transition-colors duration-200 mt-6">
              ดำเนินการสั่งซื้อ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
