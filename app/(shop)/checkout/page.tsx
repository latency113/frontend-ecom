"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cart } from "@/types/cart";
import { getCartByUserId, clearCart } from "@/lib/api/cart";
import { createOrder, uploadSlip } from "@/lib/api/orders";
import { useUser } from "@/lib/context/UserContext";
import Link from "next/link";
import Image from "next/image";
import { getAddressesByUserId } from "@/lib/api/address"; // Import address API
import { Address } from "@/types/address"; // Import Address type
import { ShoppingCart, QrCode, CreditCard, Truck, Camera, Upload, CheckCircle2 } from "lucide-react";
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
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD" | "QR">("COD"); // Default to Cash On Delivery
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      setErrorCart("กรุณาเข้าสู่ระบบเพื่อสั่งซื้อสินค้า");
      return;
    }
    if (!cart || cart.cartItems.length === 0) {
      setErrorCart("ตะกร้าสินค้าว่างเปล่า กรุณาเลือกสินค้าก่อน");
      return;
    }
    if (!selectedAddressId) {
      setErrorCart("กรุณาเลือกที่อยู่สำหรับการจัดส่ง");
      return;
    }

    if (paymentMethod === "QR" && !slipFile) {
      setErrorCart("โปรดอัปโหลดสลิปการโอนเงินเพื่อยืนยันการสั่งซื้อ");
      showToast("โปรดอัปโหลดสลิปการโอนเงิน", "error");
      return;
    }

    setIsProcessingOrder(true);
    setErrorCart(null);

    try {
      const selectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId
      );
      if (!selectedAddress) {
        throw new Error("ไม่พบที่อยู่จัดส่งที่เลือก");
      }
      
      const orderItemsPayload = cart.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price, // Capture current price at the time of order
      }));

      let paymentSlipUrl = null;
      if (paymentMethod === "QR" && slipFile) {
        showToast("กำลังอัปโหลดสลิปการโอนเงิน...", "info");
        paymentSlipUrl = await uploadSlip(slipFile);
        showToast("อัปโหลดสลิปสำเร็จ", "success");
      }

      const newOrder = await createOrder(
        user.id,
        orderItemsPayload,
        selectedAddressId,
        paymentMethod,
        paymentSlipUrl
      ); 
      console.log("Order placed successfully:", newOrder);

      // Clear the cart after successful order
      await clearCart(cart.id);
      window.dispatchEvent(new Event("cartUpdated")); // Notify Header to update cart count

      showToast("สั่งซื้อสินค้าสำเร็จ!", "success");
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
        กำลังโหลดข้อมูลการชำระเงิน...
      </div>
    );
  }

  if (userError || errorCart) {
    return (
      <div className="text-center py-20 text-red-500 text-lg">
        เกิดข้อผิดพลาด: {userError || errorCart}
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-700 mb-6">
          กรุณาเข้าสู่ระบบเพื่อดำเนินการชำระเงิน
        </p>
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          เข้าสู่ระบบ
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
            <span>ยอดรวมทั้งสิ้น:</span>
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
            สรุปการสั่งซื้อ
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
          <div className="space-y-3">
            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "COD" ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <div className="ml-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">เก็บเงินปลายทาง</p>
                  <p className="text-xs text-gray-500">จ่ายเมื่อได้รับสินค้า</p>
                </div>
              </div>
            </label>

            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "QR" ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="QR"
                checked={paymentMethod === "QR"}
                onChange={() => setPaymentMethod("QR")}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <div className="ml-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <QrCode size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">พร้อมเพย์ / QR Code</p>
                  <p className="text-xs text-gray-500">สแกนจ่ายได้ทุกธนาคาร</p>
                </div>
              </div>
            </label>

            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "CARD" ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-200 hover:bg-gray-50"}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={() => setPaymentMethod("CARD")}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <div className="ml-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">บัตรเครดิต/เดบิต</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard, JCB</p>
                </div>
              </div>
            </label>

            {paymentMethod === "QR" && (
              <div className="mt-6 p-6 bg-white border border-blue-100 rounded-2xl text-center shadow-inner">
                <div className="mb-4">
                  <p className="text-lg font-bold text-gray-900 mb-1">สแกนจ่ายผ่าน PromptPay</p>
                  <p className="text-sm text-gray-500">ยอดชำระที่ต้องโอน: <span className="text-blue-600 font-bold">{calculateTotal().toLocaleString()} บาท</span></p>
                </div>
                
                <div className="relative inline-block p-4 bg-white border-4 border-blue-600 rounded-lg mb-6 mx-auto">
                   {/* Placeholder for QR Code */}
                   <div className="w-48 h-48 bg-gray-50 flex flex-col items-center justify-center relative">
                      <Image 
                        src="/assets/facebook.png" // Using an existing asset as placeholder or a generic QR if available
                        alt="PromptPay QR Code"
                        width={200}
                        height={200}
                        className="opacity-20 grayscale"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <QrCode size={64} className="text-blue-600 mb-2" />
                        <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">PromptPay</p>
                      </div>
                   </div>
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold">
                     IT LIFE STORE
                   </div>
                </div>

                <div className="space-y-4 text-left">
                  <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Camera size={18} className="text-blue-500" />
                    อัปโหลดหลักฐานการโอนเงิน (Slip)
                  </p>
                  
                  <div className="relative group">
                    <input
                      type="file"
                      id="slipUpload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="slipUpload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${slipPreview ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:border-blue-400 group-hover:bg-blue-50"}`}
                    >
                      {slipPreview ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img src={slipPreview} alt="Slip preview" className="h-full object-contain rounded-lg py-2" />
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                            <CheckCircle2 size={16} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload size={24} className="text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">คลิกเพื่ออัปโหลดรูปภาพสลิป</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

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
                    ชื่อบนหน้าบัตร
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="ภาษาอังกฤษ (เช่น SOMCHAI DEE)"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    หมายเลขบัตร
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
                      วันหมดอายุ (ดด/ปป)
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
                      CVV / CVC
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
