"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";
import { LogIn, User,  } from "lucide-react";
import { Order } from "@/types/order";
import { getAllOrders } from "@/lib/api/orders";

const ProfilePage = () => {
  const { user, loading: loadingUser, error: userError } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        setLoadingOrders(true);
        try {
          const data = await getAllOrders(user.id);
          setOrders(data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoadingOrders(false);
        }
      }
    };
    fetchOrders();
  }, [user?.id]);

  if (loadingUser) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        กำลังโหลด...
      </div>
    );
  }

  if (userError) {
    return (
      <div className="text-center py-20 text-blue-500 text-lg">
        Error: {userError}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-700 mb-6">
          เข้าสู่ระบบเพื่อจัดการโปรไฟล์
        </p>
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 gap-2 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <LogIn className="w-5 h-5" />
          เข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const inProgressCount = orders.filter(
    (o) => o.status === "PROCESSING" || o.status === "SHIPPED"
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ข้อมูลส่วนตัว</h1>
        </div>
        <Link href="/profile/edit" className="w-full sm:w-auto">
          <button className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
            แก้ไขข้อมูลส่วนตัว
          </button>
        </Link>
      </div>

      {/* Profile Info Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
        </div>
        <div className="w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            {user.username || user.email}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {orders.length}
              </div>
              <div className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider">ออเดอร์ทั้งหมด</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {deliveredCount}
              </div>
              <div className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider">จัดส่งแล้ว</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {inProgressCount}
              </div>
              <div className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider">รอดำเนินการ</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {pendingCount}
              </div>
              <div className="text-[10px] sm:text-sm text-gray-500 uppercase tracking-wider">รอชำระเงิน</div>
            </div>
          </div>
        </div>
      </div>

      {/* User Details List */}
      <div className="border-t pt-6">
        <div className="space-y-0 divide-y divide-gray-100">
          <div className="flex flex-col sm:flex-row py-4">
            <span className="text-sm text-gray-500 sm:w-48 mb-1 sm:mb-0">ชื่อ - นามสกุล</span>
            <span className="text-sm text-gray-900 font-medium">{user.fullName}</span>
          </div>
          <div className="flex flex-col sm:flex-row py-4">
            <span className="text-sm text-gray-500 sm:w-48 mb-1 sm:mb-0">อีเมล</span>
            <span className="text-sm text-gray-900 font-medium break-all">{user.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row py-4">
            <span className="text-sm text-gray-500 sm:w-48 mb-1 sm:mb-0">หมายเลขโทรศัพท์</span>
            <span className="text-sm text-gray-900 font-medium">{user.phone || "-"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;