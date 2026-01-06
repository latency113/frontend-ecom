"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cart } from "@/types/cart";
import { getCartByUserId, clearCart } from "@/lib/api/cart";
import { createOrder } from "@/lib/api/orders";
import { useUser } from "@/lib/context/UserContext";
import Link from "next/link";
import { getAddressesByUserId } from "@/lib/api/address"; // Import address API
import { Address } from "@/types/address"; // Import Address type
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/Toast/ToastProvider"; // Import useToast

const CheckoutPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]); // New state for addresses
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  ); // New state for selected address
  const [loadingCart, setLoadingCart] = useState(true);
  const [errorCart, setErrorCart] = useState<string | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD"); // Default to Cash On Delivery
  const router = useRouter();

  const { user, loading: loadingUser, error: userError } = useUser();
  const { showToast } = useToast(); // Destructure showToast here

  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (!user?.id) {
        setLoadingCart(false);
        return;
      }
      try {
        setLoadingCart(true);
        const [cartData, addressesData] = await Promise.all([
          getCartByUserId(user.id),
          getAddressesByUserId(),
        ]);
        setCart(cartData);
        setAddresses(addressesData);

        // Set default address
        if (addressesData.length > 0) {
          const defaultAddress =
            addressesData.find((addr) => addr.isDefault) || addressesData[0];
          setSelectedAddressId(defaultAddress.id);
        }
      } catch (err: any) {
        setErrorCart(err.toString());
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCheckoutData();
  }, [user?.id]);

  const calculateTotal = () => {
    if (!cart || !cart.cartItems) return 0;
    return cart.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
  };

  const handlePlaceOrder = async () => {
    if (!user?.id) {
      setErrorCart("User not authenticated. Please log in to place an order.");
      return;
    }
    if (!cart || cart.cartItems.length === 0) {
      setErrorCart("Your cart is empty. Please add items before checking out.");
      return;
    }
    if (!selectedAddressId) {
      setErrorCart("Please select a shipping address.");
      return;
    }

    setIsProcessingOrder(true);
    setErrorCart(null);

    try {
      const selectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId
      );
      if (!selectedAddress) {
        throw new Error("Selected address not found.");
      }
      
      const orderItemsPayload = cart.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price, // Capture current price at the time of order
      }));

      const newOrder = await createOrder(
        user.id,
        orderItemsPayload,
        selectedAddressId
      ); // Pass addressId
      console.log("Order placed successfully:", newOrder);

      // Clear the cart after successful order
      await clearCart(cart.id);
      window.dispatchEvent(new Event("cartUpdated")); // Notify Header to update cart count

      router.push(`/orders/success?orderId=${newOrder.id}`); // Redirect to order success page
    } catch (err: any) {
      console.error("Error placing order:", err);
      const errorMessage = err.response?.data?.message || err.message || err.toString();
      showToast(`Error placing order: ${errorMessage}`, "error");
      setErrorCart(errorMessage);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (loadingUser || loadingCart) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading checkout...
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
          Please log in to proceed to checkout.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Login
        </Link>
      </div>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-700 mb-6">
          ตะกร้าสินค้าของคุณว่างอยู่
        </p>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 inline-flex gap-2 items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ShoppingCart/> เลือกซื้อสินค้าเลย
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900 tracking-tight">
        ชำระเงิน
      </h1>

      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3 bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl border border-gray-100">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            สินค้าในตะกร้า
          </h2>
          {cart.cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
            >
              <span className="text-gray-700">
                {item.product.name} (x{item.quantity})
              </span>
              <span className="font-medium text-gray-800">
                {(item.quantity * item.product.price).toLocaleString("th-TH", {
                  style: "currency",
                  currency: "thb",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center py-4 text-xl font-extrabold text-gray-900">
            <span>Total:</span>
            <span>
              {calculateTotal().toLocaleString("th-TH", {
                style: "currency",
                currency: "thb",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>

        <div className="lg:w-1/3 bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl border border-gray-100 mt-8 lg:mt-0">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            ข้อมูลการชำระเงินและที่อยู่จัดส่ง
          </h2>
          {/* Address Selection */}
          <div className="mb-6">
            <label
              htmlFor="shippingAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              เลือกที่อยู่สำหรับจัดส่ง
            </label>
            {addresses.length === 0 ? (
              <p className="text-red-500 text-sm">
                ไม่มีที่อยู่ โปรดเพิ่มที่อยู่ใหม่ใน{" "}
                <Link
                  href="/profile/addresses"
                  className="text-blue-600 hover:underline"
                >
                  หน้าโปรไฟล์
                </Link>
              </p>
            ) : (
              <select
                id="shippingAddress"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedAddressId || ""}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                disabled={isProcessingOrder}
              >
                <option value="">-- เลือกที่อยู่ --</option>
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.label ? `${addr.label}: ` : ""}
                    {addr.street}, {addr.city} {addr.postalCode}
                    {addr.isDefault && " (ค่าเริ่มต้น)"}
                  </option>
                ))}
              </select>
            )}
          </div>
          <h2 className="text-xl font-semibold mb-4">ช่องทางการชำระเงิน</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="cashOnDelivery"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label
                htmlFor="cashOnDelivery"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                เก็บเงินปลายทาง (Cash On Delivery)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="creditCard"
                name="paymentMethod"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={() => setPaymentMethod("CARD")}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <label
                htmlFor="creditCard"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                บัตรเครดิต/เดบิต
              </label>
            </div>

            {paymentMethod === "CARD" && (
              <div className="space-y-4 pt-4 border-t border-gray-200 mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  ข้อมูลบัตรเครดิต/เดบิต
                </h3>
                <div>
                  <label
                    htmlFor="cardName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="**** **** **** ****"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label
                      htmlFor="expiry"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="***"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {errorCart && (
            <p className="text-red-600 text-sm mt-4">{errorCart}</p>
          )}
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-blue-600 text-white py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 mt-6 disabled:opacity-50"
            disabled={
              isProcessingOrder ||
              !user?.id ||
              !selectedAddressId ||
              addresses.length === 0
            }
          >
            {isProcessingOrder
              ? "กำลังชำระเงิน..."
              : `ชำระเงิน (${calculateTotal().toLocaleString("th-TH", {
                  style: "currency",
                  currency: "thb",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
