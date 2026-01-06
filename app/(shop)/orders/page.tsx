"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllOrders, cancelOrder } from "@/lib/api/orders";
import { Order } from "@/types/order";
import { useUser } from "@/lib/context/UserContext";
import { ShoppingCart, Search, Store, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

const statusConfig = {
  PENDING: { label: "ที่ต้องชำระ", color: "text-yellow-600" },
  PROCESSING: { label: "ที่ต้องจัดส่ง", color: "text-blue-600" },
  SHIPPED: { label: "ที่ต้องได้รับ", color: "text-purple-600" },
  DELIVERED: { label: "สำเร็จแล้ว", color: "text-green-600" },
  CANCELLED: { label: "ยกเลิก", color: "text-red-600" },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );

  const { user, loading: loadingUser, error: userError } = useUser();

  const handleCancelOrder = async (orderId: string) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการยกเลิกคำสั่งซื้อนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ยกเลิกเลย!",
      cancelButtonText: "ไม่, เก็บไว้ก่อน",
    });

    if (!result.isConfirmed) {
      return;
    }

    setCancellingOrderId(orderId);
    try {
      await cancelOrder(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "CANCELLED" } : order
        )
      );
      Swal.fire("ยกเลิกแล้ว!", "คำสั่งซื้อของคุณถูกยกเลิกแล้ว.", "success");
    } catch (error: any) {
      Swal.fire(
        "ผิดพลาด",
        `ไม่สามารถยกเลิกคำสั่งซื้อได้: ${error.message}`,
        "error"
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoadingOrders(false);
        return;
      }
      try {
        setLoadingOrders(true);
        const data = await getAllOrders(user.id);
        setOrders(data);
      } catch (err: any) {
        setErrorOrders(err.toString());
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user?.id]);

  if (loadingUser || loadingOrders) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

  if (userError || errorOrders) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500">
          เกิดข้อผิดพลาด: {userError || errorOrders}
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-xl text-gray-700 mb-6">
          กรุณาเข้าสู่ระบบเพื่อดูคำสั่งซื้อ
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "all", label: "All", count: orders.length },
    {
      id: "pending",
      label: "ที่ต้องชำระ",
      count: orders.filter((o) => o.status === "PENDING").length,
    },
    {
      id: "processing",
      label: "ที่ต้องจัดส่ง",
      count: orders.filter((o) => o.status === "PROCESSING").length,
      badge: true,
    },
    {
      id: "shipped",
      label: "ที่ต้องได้รับ",
      count: orders.filter((o) => o.status === "SHIPPED").length,
    },
    {
      id: "delivered",
      label: "สำเร็จแล้ว",
      count: orders.filter((o) => o.status === "DELIVERED").length,
    },
    {
      id: "cancelled",
      label: "ยกเลิก",
      count: orders.filter((o) => o.status === "CANCELLED").length,
    },
  ];

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return order.status === "PENDING";
    if (activeTab === "processing") return order.status === "PROCESSING";
    if (activeTab === "shipped") return order.status === "SHIPPED";
    if (activeTab === "delivered") return order.status === "DELIVERED";
    if (activeTab === "cancelled") return order.status === "CANCELLED";
    return true;
  });

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-xl text-gray-700 mb-2">ไม่พบรายการคำสั่งซื้อ</p>
        <p className="text-gray-500 mb-6">เริ่มต้นช้อปปิ้งกับเราวันนี้</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          เลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Back Button & Header */}
      <div className="bg-white border-b border-gray-200 p-4 md:hidden sticky top-0 z-20 flex items-center gap-3">
        <Link href="/profile" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">รายการคำสั่งซื้อ</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky md:top-0 top-[60px] z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm whitespace-nowrap relative flex-shrink-0 ${
                  activeTab === tab.id
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-1 ${
                      activeTab === tab.id ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    ({tab.count})
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="คุณสามารถค้นหาโดย ใช้ชื่อผู้ขาย หมายเลขคำสั่งซื้อ หรือชื่อสินค้า"
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* Store Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    IT Life Store
                  </span>
                </div>
                <Link
                  href={`/orders/detail/${order.id}`}
                  className={`${statusConfig[order.status as keyof typeof statusConfig]?.color || "text-gray-600"} text-sm hover:text-blue-800`}
                >
                  {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                </Link>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <Link href={`/orders/detail/${order.id}`}>
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 mb-4 last:mb-0 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex gap-4">
                         <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={item.product.imgUrl} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 sm:hidden"> {/* Mobile view for title/price */}
                            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                              {item.product.name}
                            </h3>
                             <p className="text-xs text-gray-500 mb-1">x{item.quantity}</p>
                              <p className="text-sm font-medium text-gray-900">
                                {item.price.toLocaleString("th-TH", {
                                  style: "currency",
                                  currency: "thb",
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                })}
                              </p>
                        </div>
                      </div>
                      
                      <div className="hidden sm:flex flex-1 justify-between items-start">
                        <div>
                          <h3 className="text-sm text-gray-900 mb-1 line-clamp-2">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            ตัวเลือกสินค้า: {item.product.id.substring(0, 8)}
                          </p>
                          <p className="text-xs text-gray-500">
                            x{item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {item.price.toLocaleString("th-TH", {
                              style: "currency",
                              currency: "thb",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}{" "}
                </Link>
              </div>

              {/* Order Footer */}
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-500">
                    คุณจะได้รับสินค้าประมาณวันที่{" "}
                    {new Date(order.createdAt).toLocaleDateString("th-TH")}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      รวมการสั่งซื้อ:
                    </span>
                    <span className="text-xl font-semibold text-blue-600">
                      {order.totalAmount.toLocaleString("th-TH", {
                        style: "currency",
                        currency: "thb",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-800">
                    ติดต่อผู้ขาย
                  </button>
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={
                      (order.status !== "PENDING" &&
                        order.status !== "PROCESSING") ||
                      cancellingOrderId === order.id
                    }
                    className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancellingOrderId === order.id
                      ? "กำลังยกเลิก..."
                      : "ยกเลิกคำสั่งซื้อ"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
