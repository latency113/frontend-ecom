"use client";

import { CartItem as ICartItem } from "@/types/cart";
import { Minus, Plus, Trash } from "lucide-react"; // Import Minus and Plus icons
import Link from "next/link";

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex-shrink-0">
        {item.product.imgUrl && (
          <img
            src={item.product.imgUrl}
            alt={item.product.name}
            width={96} // Increased size slightly
            height={96} // Increased size slightly
            className="rounded-lg object-cover aspect-square"
          />
        )}
      </div>
      <div className="flex-grow">
        <Link href={`/products/${item.product.id}`}>
          <h3 className="font-bold text-lg text-gray-800">
            {item.product.name}
          </h3>
        </Link>
        <p className="text-gray-600 font-medium">
          {item.product.price.toLocaleString("th-TH", {
            style: "currency",
            currency: "thb",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}{" "}
          บาท
        </p>
      </div>
      <div className="flex items-center space-x-4 ml-auto">
        {/* Quantity Selector UI */}
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() =>
              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            className="p-2 disabled:opacity-50 text-gray-600 hover:text-gray-900"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-5 h-5" />
          </button>
          <input
            type="text"
            readOnly
            value={item.quantity}
            className="w-12 p-2 text-center border-l border-r border-gray-300 outline-none"
          />
          <button
            onClick={() =>
              onUpdateQuantity(
                item.id,
                Math.min(item.product.stock, item.quantity + 1)
              )
            }
            className="p-2 disabled:opacity-50 text-gray-600 hover:text-gray-900"
            disabled={item.quantity >= item.product.stock}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {/* End Quantity Selector UI */}

        <p className="font-bold text-lg text-gray-800 truncate">
          {(item.quantity * item.product.price).toLocaleString("th-TH", {
            style: "currency",
            currency: "thb",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </p>
        <button
          onClick={() => onRemoveItem(item.id)}
          className="text-red-600 hover:text-red-800 text-md font-medium transition-colors cursor-pointer"
        >
          <Trash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
