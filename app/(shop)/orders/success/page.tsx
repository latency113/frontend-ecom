"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Printer } from "lucide-react";
import { getOrderById } from "@/lib/api/orders";
import { Order } from "@/types/order";
import BillModal from "@/components/order/BillModal";

const OrderSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [isBillOpen, setIsBillOpen] = useState(false);

  // Redirect to home if no orderId is present (or handle as an error)
  useEffect(() => {
    if (!orderId) {
      router.replace("/"); // Redirect to home or an error page
    } else {
      // Fetch order details for the bill
      getOrderById(orderId).then(setOrder).catch(console.error);
    }
  }, [orderId, router]);

  if (!orderId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">กำลังนำคุณไปยังหน้าอื่น...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 p-4">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4 text-center">
        คำสั่งซื้อสำเร็จ!
      </h1>
      <p className="text-xl text-gray-700 mb-8 text-center max-w-lg">
        ขอขอบคุณสำหรับการสั่งซื้อของคุณ! คำสั่งซื้อของคุณได้รับการยืนยันแล้ว
      </p>
      {orderId && (
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={`/orders/detail/${orderId}`}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 text-lg font-medium"
          >
            ดูรายละเอียดคำสั่งซื้อ
          </Link>
          <button
            onClick={() => setIsBillOpen(true)}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 text-lg font-medium"
          >
            <Printer className="w-5 h-5" />
            <span>พิมพ์ใบแจ้งหนี้</span>
          </button>
          <Link
            href="/"
            className="px-8 py-3 border border-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200 text-lg font-medium"
          >
            กลับสู่หน้าหลัก
          </Link>
        </div>
      )}

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

export default OrderSuccessPage;
