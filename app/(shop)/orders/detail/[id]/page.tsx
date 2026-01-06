"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderById, cancelOrder } from "@/lib/api/orders";
import { Order } from "@/types/order";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  FileText,
  CreditCard,
  Truck,
  Package,
  Star,
} from "lucide-react";

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);

  const handleCancelOrder = async () => {
    if (!order) return;

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

    setCancellingOrder(true);
    try {
      await cancelOrder(order.id);
      setOrder((prevOrder) =>
        prevOrder ? { ...prevOrder, status: "CANCELLED" } : null
      );
      Swal.fire(
        "ยกเลิกแล้ว!",
        "คำสั่งซื้อของคุณถูกยกเลิกเรียบร้อยแล้ว.",
        "success"
      );
    } catch (err: any) {
      Swal.fire(
        "ผิดพลาด",
        `ไม่สามารถยกเลิกคำสั่งซื้อได้: ${err.message}`,
        "error"
      );
    } finally {
      setCancellingOrder(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        setError("ไม่พบรหัสคำสั่งซื้อ");
        return;
      }
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err: any) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500">เกิดข้อผิดพลาด: {error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">ไม่พบคำสั่งซื้อ</div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const updatedDate = new Date(order.updatedAt).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const dynamicSteps = [
    {
      icon: FileText,
      label: "มีคำสั่งซื้อใหม่",
      date: orderDate,
      status: "PENDING",
    },
    {
      icon: CreditCard,
      label: "ข้อมูลการชำระเงินได้รับการยืนยันแล้ว",
      date:
        order.status === "PROCESSING" ||
        order.status === "SHIPPED" ||
        order.status === "DELIVERED"
          ? updatedDate
          : "",
      status: "PROCESSING",
    },
    {
      icon: Truck,
      label: "ที่ต้องจัดส่ง",
      date:
        order.status === "SHIPPED" || order.status === "DELIVERED"
          ? updatedDate
          : "",
      status: "SHIPPED",
    },
    {
      icon: Package,
      label: "ที่ต้องได้รับ",
      date: order.status === "DELIVERED" ? updatedDate : "",
      status: "DELIVERED",
    },
    {
      icon: Star,
      label: "ให้คะแนน",
      date: "",
      status: "DELIVERED",
    },
  ];

  const currentStepIndex = dynamicSteps.findIndex(
    (step) => step.status === order.status
  );

  // Adjust currentStepIndex for "DELIVERED" to light up all steps before "ให้คะแนน"
  const actualCurrentStepIndex =
    order.status === "DELIVERED" ? dynamicSteps.length - 2 : currentStepIndex;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">ย้อนกลับ</span>
            </button>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">
                หมายเลขคำสั่งซื้อ: {order.id}
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-sm font-medium text-blue-600">
                {order.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Progress Steps */}
        <div className="bg-white rounded-lg p-6 mb-4 overflow-hidden">
          <div className="relative mb-8 overflow-x-auto pb-4 no-scrollbar">
            {/* Background line container to ensure min-width */}
            <div className="min-w-[500px] relative"> 
              {/* Background line */}
              <div
                className="absolute top-6 left-0 right-0 h-0.5 bg-gray-300"
                style={{
                  left: `calc(50% / ${dynamicSteps.length})`,
                  right: `calc(50% / ${dynamicSteps.length})`,
                }}
              />

              {/* Active line overlay */}
              <div
                className="absolute top-6 left-0 h-0.5 bg-green-500 transition-all duration-500"
                style={{
                  left: `calc(50% / ${dynamicSteps.length})`,
                  width: `calc((100% - 100% / ${
                    dynamicSteps.length
                  } * 2) * ${actualCurrentStepIndex} / ${
                    dynamicSteps.length - 1
                  })`,
                }}
              />

              <div className="flex items-start justify-between relative">
                {dynamicSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center relative"
                    style={{ flex: 1 }}
                  >
                    {/* Circle icon */}
                    <div
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-2 flex-shrink-0 ${
                        index <= actualCurrentStepIndex
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>

                    {/* Label */}
                    <p
                      className={`text-xs text-center max-w-[100px] sm:max-w-[120px] ${
                        index <= actualCurrentStepIndex
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-xs text-gray-400 mt-1 whitespace-nowrap">{step.date}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Info
          <div className="bg-blue-50 rounded p-4 text-sm text-gray-700">
            <p className="mb-1">
              {order.status === "DELIVERED"
                ? `สินค้าของคุณถูกจัดส่งเมื่อ ${new Date(
                    order.updatedAt
                  ).toLocaleDateString("th-TH")} และได้รับแล้ว`
                : `คุณจะได้รับสินค้าประมาณวันที่ ${new Date(
                    order.createdAt
                  ).toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })} + 3-5 วันทำการ`}{" "}
              กรุณาชำระเงินทันตามคำสั่งซื้อแล้วได้รับสินค้าแล้ว
            </p>
            <p className="text-gray-600">
              ⓘ การคืนสินค้าสินค้า: รับได้สูงสุด ฿30 หากไม่ได้รับสินค้าภายใน
              07-01-2026{" "}
              <button className="text-blue-600 hover:underline">
                ดูเพิ่มเติม
              </button>
            </p>
          </div> */}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button className="px-6 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
              ติดต่อผู้ขาย
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={
                (order.status !== "PENDING" && order.status !== "PROCESSING") ||
                cancellingOrder
              }
              className="px-6 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancellingOrder ? "กำลังยกเลิก..." : "ยกเลิกคำสั่งซื้อ"}
            </button>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg p-6 mb-4">
          <h2 className="text-lg font-medium mb-4">ที่อยู่ในการจัดส่ง</h2>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex gap-2">
                <Package className="w-5 h-5 text-green-500" />
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>
              <div className="text-sm text-gray-700">
                {order.address.street}
                {order.address.city ? `, ${order.address.city}` : ''}
                {order.address.stateProvince ? `, ${order.address.stateProvince}` : ''}
                {order.address.postalCode ? ` ${order.address.postalCode}` : ''}
                {order.address.country ? `, ${order.address.country}` : ''}
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col mb-2">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <span>สั่งเมื่อ:</span>
                  <span>{orderDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  {(() => {
                    let statusText = "";
                    let bgColor = "bg-gray-500";
                    let textColor = "text-gray-600";

                    switch (order.status) {
                      case "PENDING":
                        statusText = "กำลังรอชำระเงิน";
                        bgColor = "bg-yellow-500";
                        textColor = "text-yellow-600";
                        break;
                      case "PROCESSING":
                        statusText = "กำลังดำเนินการจัดส่ง";
                        bgColor = "bg-blue-500";
                        textColor = "text-blue-600";
                        break;
                      case "SHIPPED":
                        statusText = "สินค้ากำลังจัดส่ง";
                        bgColor = "bg-purple-500";
                        textColor = "text-purple-600";
                        break;
                      case "DELIVERED":
                        statusText = "สินค้าถูกจัดส่งสำเร็จ";
                        bgColor = "bg-green-500";
                        textColor = "text-green-600";
                        break;
                      case "CANCELLED":
                        statusText = "คำสั่งซื้อถูกยกเลิก";
                        bgColor = "bg-red-500";
                        textColor = "text-red-600";
                        break;
                      default:
                        statusText = "สถานะไม่ระบุ";
                        break;
                    }

                    return (
                      <>
                        <span
                          className={`px-2 py-0.5 ${bgColor} text-white text-xs rounded`}
                        >
                          {statusText}
                        </span>
                        <span className="text-gray-500 text-xs ml-2">
                          {updatedDate}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store and Products */}
        <div className="bg-white rounded-lg overflow-hidden mb-4">
          {/* Products */}
          <div className="p-6">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-6 border-b last:border-b-0"
              >
                <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {item.product.imgUrl ? (
                    <img
                      src={item.product.imgUrl}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Package className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm text-gray-900 mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    ตัวเลือกสินค้า: {item.product.id.substring(0, 8)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">x{item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">
                    {item.price.toLocaleString("th-TH", {
                      style: "currency",
                      currency: "thb",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">รวมค่าสินค้า</span>
              <span className="text-gray-900">
                {order.totalAmount.toLocaleString("th-TH", {
                  style: "currency",
                  currency: "thb",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="text-base font-medium">รวมการสั่งซื้อ</span>
              <span className="text-2xl font-semibold text-blue-600">
                {order.totalAmount.toLocaleString("th-TH", {
                  style: "currency",
                  currency: "thb",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">ช่องทางการชำระเงิน</p>
            <p className="text-sm text-gray-900 font-medium mt-1">
              เก็บเงินปลายทาง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
