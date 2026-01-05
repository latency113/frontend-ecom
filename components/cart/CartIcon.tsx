"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface CartIconProps {
  itemCount: number;
}

const CartIcon = ({ itemCount }: CartIconProps) => {
  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="text-2xl" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
