"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import CartIcon from "./../cart/CartIcon";
import { getCartByUserId } from "@/lib/api/cart";
import { Cart } from "@/types/cart";
import { useUser } from "@/lib/context/UserContext";
import SearchInput from "./SearchInput";
import { User } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loadingCart, setLoadingCart] = useState(true);
  const [errorCart, setErrorCart] = useState<string | null>(null); // Reintroduced
  const { user, loading: loadingUser } = useUser();

  useEffect(() => {
    const fetchCartItemCount = async () => {
      if (!user?.id) {
        setCartItemCount(0);
        setLoadingCart(false);
        return;
      }
      try {
        setLoadingCart(true);
        const data: Cart | null = await getCartByUserId(user.id); // Data can now be null
        if (data === null) {
          setCartItemCount(0); // No cart found, so 0 items
          setErrorCart(null); // Clear any previous error
        } else {
          const totalItems = data.cartItems.reduce((sum, item) => sum + item.quantity, 0);
          setCartItemCount(totalItems);
        }
      } catch (err: any) {
        console.error("Error fetching cart item count:", err);
        setErrorCart(err.toString());
        setCartItemCount(0); // Ensure count is 0 on error
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCartItemCount();

    const handleCartUpdated = () => {
      fetchCartItemCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [user?.id]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Icons Row for Mobile */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link href="/" className="text-2xl text-blue-500 font-bold tracking-tight">
              IT Life Store
            </Link>

            {/* Mobile Icons (Visible on mobile, hidden on desktop if you want, but here we keep them together or split) */}
            {/* Actually, let's keep the original structure but adapt flex order */}
            <div className="flex items-center gap-4 md:hidden">
               <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                <User className="w-6 h-6" />
              </Link>
              {(loadingUser || loadingCart) ? (
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              ) : (
                <CartIcon itemCount={cartItemCount} />
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 w-full md:max-w-2xl md:mx-8">
            <SearchInput />
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/profile" className="text-gray-700 hover:text-gray-900">
              <User className="w-6 h-6" />
            </Link>
            {(loadingUser || loadingCart) ? (
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            ) : (
              <CartIcon itemCount={cartItemCount} />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="container mx-auto px-4 md:px-6 py-3">
        <Navbar />
      </div>
    </header>
  );
};

export default Header;