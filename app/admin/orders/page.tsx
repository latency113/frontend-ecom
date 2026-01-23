"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Order } from "@/types/order";
import { getAllOrders } from "@/lib/api/admin/orders";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { ShoppingBag, Search, Eye, Calendar, User, Filter } from "lucide-react";

const AdminOrderListPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [backendTotalCount, setBackendTotalCount] = useState(0);
  const [backendTotalPages, setBackendTotalPages] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders(
          currentPage,
          itemsPerPage,
          searchTerm,
          statusFilter
        );
        if (!response.data) {
          showToast("API did not return data for orders.", "error");
          setOrders([]);
          setBackendTotalCount(0);
          setBackendTotalPages(0);
          return;
        }
        setOrders(response.data);
        setBackendTotalCount(response.totalCount);
        setBackendTotalPages(response.totalPages);
      } catch (err: any) {
        showToast(
          `Error fetching orders: ${err.message || err.toString()}`,
          "error"
        );
        setOrders([]);
        setBackendTotalCount(0);
        setBackendTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [showToast, currentPage, itemsPerPage, searchTerm, statusFilter]);

  // Reset to first page when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            จัดการคำสั่งซื้อ
          </h1>
          <p className="text-sm text-gray-600">
            ทั้งหมด {backendTotalCount} คำสั่งซื้อ
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหา Order ID, ลูกค้า หรืออีเมล..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative sm:w-64">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">ทุกสถานะ</option>
                <option value="PENDING">รอดำเนินการ</option>
                <option value="PROCESSING">กำลังดำเนินการ</option>
                <option value="SHIPPED">กำลังจัดส่ง</option>
                <option value="DELIVERED">จัดส่งแล้ว</option>
                <option value="CANCELLED">ยกเลิก</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    คำสั่งซื้อ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ลูกค้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ยอดรวม
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่สั่งซื้อ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">ไม่พบคำสั่งซื้อ</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              #{order.id.substring(0, 8)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.items?.length || 0} รายการ
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {order.user?.fullName ||
                              order.user?.username ||
                              order.user?.email ||
                              order.userId.substring(0, 8)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          ฿{order.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            statusConfig[
                              order.status as keyof typeof statusConfig
                            ]?.color ||
                            "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {statusConfig[
                            order.status as keyof typeof statusConfig
                          ]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link href={`/admin/orders/${order.id}/edit`}>
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                            ดู/แก้ไข
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">ทั้งหมด</p>
            <p className="text-xl font-semibold text-gray-900">
              {backendTotalCount}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">รอดำเนินการ</p>
            <p className="text-xl font-semibold text-yellow-600">
              {orders.filter((o) => o.status === "PENDING").length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">กำลังดำเนินการ</p>
            <p className="text-xl font-semibold text-blue-600">
              {orders.filter((o) => o.status === "PROCESSING").length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">กำลังจัดส่ง</p>
            <p className="text-xl font-semibold text-purple-600">
              {orders.filter((o) => o.status === "SHIPPED").length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">จัดส่งแล้ว</p>
            <p className="text-xl font-semibold text-green-600">
              {orders.filter((o) => o.status === "DELIVERED").length}
            </p>
          </div>
        </div>

        {/* Pagination Controls */}
        {backendTotalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              ย้อนกลับ
            </button>
            <span className="text-sm text-gray-700">
              หน้า {currentPage} จาก {backendTotalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, backendTotalPages))
              }
              disabled={currentPage === backendTotalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              ถัดไป
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderListPage;
