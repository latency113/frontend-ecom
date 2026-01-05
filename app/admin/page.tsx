"use client"
import { Package, FolderTree, ShoppingBag, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getTotalProducts,
  getOrdersToday,
  getPendingOrders,
  getTotalUsers,
} from "@/lib/api/admin/dashboard";

const AdminDashboardPage = () => {
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [ordersToday, setOrdersToday] = useState<number | null>(null);
  const [pendingOrders, setPendingOrders] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const [products, todayOrders, pending, users] = await Promise.all([
          getTotalProducts(),
          getOrdersToday(),
          getPendingOrders(),
          getTotalUsers(),
        ]);
        setTotalProducts(products);
        setOrdersToday(todayOrders);
        setPendingOrders(pending);
        setTotalUsers(users);
      } catch (err: any) {
        setErrorStats(err.toString());
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const menuItems = [
    {
      title: "จัดการสินค้า",
      description: "ดู เพิ่ม แก้ไข และลบสินค้า",
      href: "/admin/products",
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "จัดการหมวดหมู่",
      description: "ดู เพิ่ม แก้ไข และลบหมวดหมู่สินค้า",
      href: "/admin/categories",
      icon: FolderTree,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "จัดการคำสั่งซื้อ",
      description: "ดูและอัพเดทคำสั่งซื้อของลูกค้า",
      href: "/admin/orders",
      icon: ShoppingBag,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "จัดการผู้ใช้",
      description: "ดู แก้ไข และจัดการบัญชีผู้ใช้",
      href: "/admin/users",
      icon: Users,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">จัดการระบบร้านค้าของคุณ</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600">
                {item.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">สินค้าทั้งหมด</p>
            {loadingStats ? (
              <p className="text-2xl font-semibold text-gray-900">Loading...</p>
            ) : errorStats ? (
              <p className="text-xl text-red-500">Error!</p>
            ) : (
              <p className="text-2xl font-semibold text-gray-900">{totalProducts}</p>
            )}
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">คำสั่งซื้อวันนี้</p>
            {loadingStats ? (
              <p className="text-2xl font-semibold text-gray-900">Loading...</p>
            ) : errorStats ? (
              <p className="text-xl text-red-500">Error!</p>
            ) : (
              <p className="text-2xl font-semibold text-gray-900">{ordersToday}</p>
            )}
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">รอดำเนินการ</p>
            {loadingStats ? (
              <p className="text-2xl font-semibold text-gray-900">Loading...</p>
            ) : errorStats ? (
              <p className="text-xl text-red-500">Error!</p>
            ) : (
              <p className="text-2xl font-semibold text-gray-900">{pendingOrders}</p>
            )}
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">ผู้ใช้ทั้งหมด</p>
            {loadingStats ? (
              <p className="text-2xl font-semibold text-gray-900">Loading...</p>
            ) : errorStats ? (
              <p className="text-xl text-red-500">Error!</p>
            ) : (
              <p className="text-2xl font-semibold text-gray-900">{totalUsers}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;