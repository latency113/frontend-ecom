"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Category } from "@/types/category";
import { getAllCategories, deleteCategory } from "@/lib/api/admin/categories";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import Swal from "sweetalert2";
import { FolderTree, Plus, Edit2, Trash2, Search } from "lucide-react";

const AdminCategoryListPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [backendTotalCount, setBackendTotalCount] = useState(0);
  const [backendTotalPages, setBackendTotalPages] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategories(
          currentPage,
          itemsPerPage,
          searchTerm
        );
        if (!response.data) {
          showToast("API did not return data for categories.", "error");
          setCategories([]);
          setBackendTotalCount(0);
          setBackendTotalPages(0);
          return;
        }
        setCategories(response.data);
        setBackendTotalCount(response.totalCount);
        setBackendTotalPages(response.totalPages);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        showToast(
          `Error fetching categories: ${err.message || err.toString()}`,
          "error"
        );
        setCategories([]);
        setBackendTotalCount(0);
        setBackendTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [showToast, currentPage, itemsPerPage, searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (categoryId: string) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(categoryId);
        // After deletion, re-fetch data to ensure pagination is correct
        // No need to filter locally, new fetch will get updated list
        showToast("ลบหมวดหมู่สำเร็จ!", "success");
        // Re-fetch current page to reflect changes
        const response = await getAllCategories(
          currentPage,
          itemsPerPage,
          searchTerm
        );
        if (response.data.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1); // Go to previous page if current page becomes empty
        } else {
          setCategories(response.data);
          setBackendTotalCount(response.totalCount);
          setBackendTotalPages(response.totalPages);
        }
      } catch (err: any) {
        console.error("Error deleting category:", err);
        showToast(
          `เกิดข้อผิดพลาดในการลบหมวดหมู่: ${err.message || err.toString()}`,
          "error"
        );
      }
    }
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              จัดการหมวดหมู่
            </h1>

            <p className="text-sm text-gray-600">
              ทั้งหมด {backendTotalCount} หมวดหมู่
            </p>
          </div>

          <Link href="/admin/categories/create">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" />
              เพิ่มหมวดหมู่ใหม่
            </button>
          </Link>
        </div>

        {/* Search */}

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="ค้นหาหมวดหมู่..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หมวดหมู่
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รายละเอียด
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-3" />

                      <p className="text-gray-500 text-sm">ไม่พบหมวดหมู่</p>
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FolderTree className="w-5 h-5 text-purple-600" />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {category.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              ID: {category.id.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {category.description || "-"}
                        </p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/categories/${category.id}/edit`}>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </Link>

                          <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

export default AdminCategoryListPage;
