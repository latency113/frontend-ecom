"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderById, cancelOrder } from "@/lib/api/orders";
import { Order } from "@/types/order";
import BillModal from "@/components/order/BillModal";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  FileText,
  CreditCard,
  Truck,
  Package,
  Star,
  CheckCircle2,
  Printer,
} from "lucide-react";

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [isBillOpen, setIsBillOpen] = useState(false);

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
      label: "สั่งซื้อสำเร็จ",
      date: orderDate,
      status: "PENDING",
    },
    {
      icon: CreditCard,
      label: order.paymentMethod === "COD" ? "ยืนยันรายการสั่งซื้อ" : "ชำระเงินสำเร็จ",
      date:
        order.status === "PROCESSING" ||
        order.status === "SHIPPED" ||
        order.status === "DELIVERED"
          ? updatedDate
          : (order.status === "PENDING" && order.paymentMethod !== "COD" ? "รอการตรวจสอบสลิป" : ""),
      status: "PROCESSING",
    },
    {
      icon: Truck,
      label: "กำลังจัดส่ง",
      date:
        order.status === "SHIPPED" || order.status === "DELIVERED"
          ? updatedDate
          : "",
      status: "SHIPPED",
    },
    {
      icon: Package,
      label: "ได้รับสินค้าแล้ว",
      date: order.status === "DELIVERED" ? updatedDate : "",
      status: "DELIVERED",
    },
  ];

  // Logic to determine which step is active
  let actualCurrentStepIndex = 0;
  if (order.status === "PENDING") {
    actualCurrentStepIndex = 0;
  } else if (order.status === "PROCESSING") {
    actualCurrentStepIndex = 1;
  } else if (order.status === "SHIPPED") {
    actualCurrentStepIndex = 2;
  } else if (order.status === "DELIVERED") {
    actualCurrentStepIndex = 3;
  } else if (order.status === "CANCELLED") {
    actualCurrentStepIndex = -1;
  }

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
                 {(() => {
                    switch (order.status) {
                      case "PENDING": return order.paymentMethod === "COD" ? "รอยืนยัน" : "รอตรวจสอบการชำระเงิน";
                      case "PROCESSING": return "กำลังเตรียมจัดส่ง";
                      case "SHIPPED": return "อยู่ระหว่างการจัดส่ง";
                      case "DELIVERED": return "จัดส่งสำเร็จ";
                      case "CANCELLED": return "ยกเลิกแล้ว";
                      default: return order.status;
                    }
                 })()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Progress Steps */}
        <div className="bg-white rounded-lg p-6 mb-4 overflow-hidden shadow-sm">
          {order.status === "CANCELLED" ? (
            <div className="flex flex-col items-center py-10 text-red-500">
               <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                 <FileText size={40} />
               </div>
               <h3 className="text-2xl font-bold">คำสั่งซื้อนี้ถูกยกเลิกแล้ว</h3>
               <p className="text-gray-500 mt-2">รายการนี้จะไม่ถูกดำเนินการต่อ หากมีข้อสงสัยโปรดติดต่อเรา</p>
            </div>
          ) : (
            <div className="relative mb-8 overflow-x-auto pb-4 no-scrollbar">
              {/* Background line container to ensure min-width */}
              <div className="min-w-[600px] relative pt-2"> 
                {/* Background line (Gray) */}
                <div
                  className="absolute top-8 left-0 right-0 h-1 bg-gray-100 rounded-full"
                  style={{
                    left: `calc(100% / ${dynamicSteps.length * 2})`,
                    right: `calc(100% / ${dynamicSteps.length * 2})`,
                  }}
                />

                {/* Active line overlay (Green) */}
                <div
                  className="absolute top-8 left-0 h-1 bg-green-500 transition-all duration-700 ease-in-out rounded-full"
                  style={{
                    left: `calc(100% / ${dynamicSteps.length * 2})`,
                    width: actualCurrentStepIndex > 0 
                      ? `calc((100% / ${dynamicSteps.length} * ${actualCurrentStepIndex}) - (100% / ${dynamicSteps.length * 2}))`
                      : "0%",
                  }}
                />

                <div className="flex items-start justify-between relative">
                  {dynamicSteps.map((step, index) => {
                    const isActive = index <= actualCurrentStepIndex;
                    const isCompleted = index < actualCurrentStepIndex;
                    const isCurrent = index === actualCurrentStepIndex;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center relative"
                        style={{ flex: 1 }}
                      >
                        {/* Circle icon */}
                        <div
                          className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-500 border-4 ${
                            isActive
                              ? "bg-green-500 border-green-100 text-white shadow-lg shadow-green-500/20 scale-110"
                              : "bg-white border-gray-100 text-gray-300 shadow-inner"
                          }`}
                        >
                          <step.icon className={`w-6 h-6 ${isCurrent ? "animate-pulse" : ""}`} />
                          
                          {isCompleted && (
                            <div className="absolute -right-1 -top-1 bg-white rounded-full p-0.5 shadow-md">
                               <div className="bg-green-500 rounded-full p-1">
                                 <CheckCircle2 className="w-3 h-3 text-white" />
                               </div>
                            </div>
                          )}
                        </div>

                        {/* Label */}
                        <div className="text-center px-2">
                          <p
                            className={`text-sm font-bold transition-colors duration-500 ${
                              isActive ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          {step.date ? (
                            <p className="text-[11px] text-gray-400 mt-1 font-medium bg-gray-50 px-2 py-0.5 rounded-full inline-block">
                              {step.date}
                            </p>
                          ) : isCurrent && order.status === "PENDING" && order.paymentMethod !== "COD" ? (
                             <p className="text-[10px] text-blue-500 mt-1 font-bold animate-pulse">
                               รอยืนยันสลิป
                             </p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-50">
            {order.status !== "CANCELLED" && (
              <button 
                onClick={() => setIsBillOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์ใบแจ้งหนี้</span>
              </button>
            )}
            <button className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              ติดต่อฝ่ายบริการลูกค้า
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={
                (order.status !== "PENDING" && order.status !== "PROCESSING") ||
                cancellingOrder
              }
              className="px-6 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
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
                <span className="font-medium">ข้อมูลการจัดส่ง</span>
              </div>
              <div className="text-sm text-gray-700">
                {order.address}
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
                        statusText = "กำลังรอการยืนยัน";
                        bgColor = "bg-yellow-500";
                        break;
                      case "PROCESSING":
                        if (order.paymentMethod !== "COD") {
                          statusText = "ชำระเงินแล้ว (รอตรวจสอบ)";
                          bgColor = "bg-blue-500";
                        } else {
                          statusText = "กำลังเตรียมจัดส่ง";
                          bgColor = "bg-blue-600";
                        }
                        break;
                      case "SHIPPED":
                        statusText = "สินค้ากำลังจัดส่ง";
                        bgColor = "bg-purple-500";
                        break;
                      case "DELIVERED":
                        statusText = "สินค้าถูกจัดส่งสำเร็จ";
                        bgColor = "bg-green-500";
                        break;
                      case "CANCELLED":
                        statusText = "คำสั่งซื้อถูกยกเลิก";
                        bgColor = "bg-red-500";
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
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ช่องทางการชำระเงิน</p>
              <p className="text-sm text-gray-900 font-medium mt-1">
                {order.paymentMethod === "COD" ? "เก็บเงินปลายทาง" : 
                 order.paymentMethod === "QR" ? "พร้อมเพย์ / QR Code" : 
                 "บัตรเครดิต/เดบิต"}
              </p>
            </div>
            {order.paymentSlip && (
              <div>
                <p className="text-sm text-gray-600 mb-2">หลักฐานการชำระเงิน</p>
                {(() => {
                  const slipUrl = order.paymentSlip.startsWith('http') 
                    ? order.paymentSlip 
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '')}${order.paymentSlip}`;
                  
                  return (
                    <div className="relative w-32 h-48 border rounded-lg overflow-hidden bg-gray-100 group cursor-pointer"
                         onClick={() => window.open(slipUrl, '_blank')}>
                       <img 
                        src={slipUrl} 
                        alt="Payment Slip" 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                       />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-white text-xs font-bold">ดูรูปขยาย</span>
                       </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {order && (
        <BillModal 
          order={order} 
          isOpen={isBillOpen} 
          onClose={() => setIsBillOpen(false)} 
        />
      )}
    </div>
  );
};

export default OrderDetailPage;
