"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Order } from "@/types/order";
import { getOrderById, updateOrderStatus } from "@/lib/api/admin/orders";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import {
  ArrowLeft,
  ShoppingBag,
  User,
  Calendar,
  CreditCard,
  Package,
  CheckCircle,
} from "lucide-react";

const AdminOrderEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const data = await getOrderById(orderId);
        if (data) {
          setOrder(data);
          setSelectedStatus(data.status);
        } else {
          showToast("ไม่พบคำสั่งซื้อ", "error");
        }
      } catch (err: any) {
        showToast(`เกิดข้อผิดพลาด: ${err.message || err.toString()}`, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, showToast]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!order) return;

    try {
      await updateOrderStatus(orderId, selectedStatus);
      setOrder((prevOrder) =>
        prevOrder
          ? { ...prevOrder, status: selectedStatus as Order["status"] }
          : null
      );
      showToast("อัพเดทสถานะสำเร็จ!", "success");
      router.push("/admin/orders");
    } catch (err: any) {
      console.error("Error updating order status:", err);
      showToast(`เกิดข้อผิดพลาด: ${err.message || err.toString()}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusConfig = {
    PENDING: {
      label: "รอดำเนินการ",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    PROCESSING: {
      label: "กำลังดำเนินการ",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    SHIPPED: {
      label: "กำลังจัดส่ง",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    DELIVERED: {
      label: "จัดส่งแล้ว",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    CANCELLED: {
      label: "ยกเลิก",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">ย้อนกลับ</span>
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                รายละเอียดคำสั่งซื้อ
              </h1>
              <p className="text-sm text-gray-500">
                #{order.id.substring(0, 16)}
              </p>
            </div>
          </div>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            ข้อมูลคำสั่งซื้อ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-1">ลูกค้า</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.user?.fullName || order.user?.username || order.user?.email || order.userId}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-1">วันที่สั่งซื้อ</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-1">ยอดรวม</p>
                <p className="text-lg font-semibold text-gray-900">
                  ฿{order.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-1">สถานะปัจจุบัน</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    statusConfig[order.status as keyof typeof statusConfig]
                      ?.color
                  }`}
                >
                  {
                    statusConfig[order.status as keyof typeof statusConfig]
                      ?.label
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Slip Card */}
        {order.paymentSlip && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              หลักฐานการชำระเงิน
            </h2>
            <div className="relative w-full max-w-sm mx-auto aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 group cursor-pointer"
                 onClick={() => window.open(order.paymentSlip!.startsWith('http') ? order.paymentSlip! : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '')}${order.paymentSlip}`, '_blank')}>
              <img 
                src={order.paymentSlip.startsWith('http') ? order.paymentSlip : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '')}${order.paymentSlip}`} 
                alt="Payment Slip" 
                className="w-full h-full object-contain transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-bold bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30">คลิกเพื่อดูรูปขยาย</span>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-3 italic">
              * โปรดตรวจสอบความถูกต้องของยอดเงินและวันที่ในสลิปก่อนกดยืนยันสถานะ
            </p>
          </div>
        )}

        {/* Order Items Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            รายการสินค้า
          </h2>
          {order.items && order.items.length > 0 ? (
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src={item.product.imgUrl} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {item.product?.name || "Unknown Product"}
                    </p>
                    <p className="text-xs text-gray-500">
                      จำนวน: {item.quantity} × ฿{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ฿{(item.quantity * item.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">ไม่มีรายการสินค้า</p>
            </div>
          )}
        </div>

        {/* Update Status Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              อัพเดทสถานะ
            </h2>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                เลือกสถานะใหม่
              </label>
              <select
                id="status"
                name="status"
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors appearance-none bg-white"
              >
                <option value="PENDING">รอดำเนินการ</option>
                <option value="PROCESSING">กำลังดำเนินการ</option>
                <option value="SHIPPED">กำลังจัดส่ง</option>
                <option value="DELIVERED">จัดส่งแล้ว</option>
                <option value="CANCELLED">ยกเลิก</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/orders")}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังอัพเดท..." : "อัพเดทสถานะ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminOrderEditPage;
