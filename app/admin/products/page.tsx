"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { getAllProducts, deleteProduct } from "@/lib/api/admin/products";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import Swal from "sweetalert2";
import { getAllCategories } from "@/lib/api/admin/categories";
import { Category } from "@/types/category";
import { Search, Plus, Edit2, Trash2, Package, Filter } from "lucide-react";

const AdminProductListPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [backendTotalCount, setBackendTotalCount] = useState(0);
  const [backendTotalPages, setBackendTotalPages] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        // Fetch products with pagination
        const productsResponse = await getAllProducts(currentPage, itemsPerPage, searchTerm, selectedCategoryId);
        if (!productsResponse.data) {
          showToast("API did not return data for products.", "error");
          setProducts([]);
          setBackendTotalCount(0);
          setBackendTotalPages(0);
        } else {
          setProducts(productsResponse.data);
          setBackendTotalCount(productsResponse.totalCount);
          setBackendTotalPages(productsResponse.totalPages);
        }

        // Fetch all categories (categories are not paginated here, as they are used for filtering)
        const categoriesData = await getAllCategories();
        if (!Array.isArray(categoriesData.data)) { // Note: getAllCategories now returns an object with 'data'
          showToast("API did not return an array for categories.", "error");
          setCategories([]);
        } else {
          setCategories(categoriesData.data);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        showToast(
          `Error fetching data: ${err.message || err.toString()}`,
          "error"
        );
        setProducts([]);
        setCategories([]);
        setBackendTotalCount(0);
        setBackendTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsAndCategories();
  }, [showToast, currentPage, itemsPerPage, searchTerm, selectedCategoryId]);

  const getCategoryNameById = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  // Reset to first page when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategoryId]);

  const handleDelete = async (productId: string) => {
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
        await deleteProduct(productId);
        showToast("ลบสินค้าสำเร็จ!", "success");
        // Re-fetch current page to reflect changes
        const productsResponse = await getAllProducts(currentPage, itemsPerPage, searchTerm, selectedCategoryId);
        if (productsResponse.data.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1); // Go to previous page if current page becomes empty
        } else {
          setProducts(productsResponse.data);
          setBackendTotalCount(productsResponse.totalCount);
          setBackendTotalPages(productsResponse.totalPages);
        }
      } catch (err: any) {
        console.error("Error deleting product:", err);
        showToast(
          `เกิดข้อผิดพลาดในการลบสินค้า: ${err.message || err.toString()}`,
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

        <div className="container mx-auto px-4 py-8 max-w-7xl">

          {/* Header */}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

            <div>

              <h1 className="text-2xl font-semibold text-gray-900 mb-1">

                จัดการสินค้า

              </h1>

              <p className="text-sm text-gray-600">

                ทั้งหมด {backendTotalCount} รายการ

              </p>

            </div>

            <Link href="/admin/products/create">

              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">

                <Plus className="w-4 h-4" />

                เพิ่มสินค้าใหม่

              </button>

            </Link>

          </div>

  

          {/* Search and Filter */}

          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">

            <div className="flex flex-col sm:flex-row gap-3">

              <div className="relative flex-1">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input

                  type="text"

                  placeholder="ค้นหาชื่อสินค้า..."

                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"

                  value={searchTerm}

                  onChange={(e) => setSearchTerm(e.target.value)}

                />

              </div>

              <div className="relative sm:w-64">

                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <select

                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors appearance-none bg-white"

                  value={selectedCategoryId || ""}

                  onChange={(e) =>

                    setSelectedCategoryId(e.target.value === "" ? null : e.target.value)

                  }

                >

                  <option value="">ทุกหมวดหมู่</option>

                  {categories.map((category) => (

                    <option key={category.id} value={category.id}>

                      {category.name}

                    </option>

                  ))}

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

                      สินค้า

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                      ราคา

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                      สต็อก

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                      หมวดหมู่

                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">

                      จัดการ

                    </th>

                  </tr>

                </thead>

                <tbody className="bg-white divide-y divide-gray-200">

                  {products.length === 0 ? (

                    <tr>

                      <td colSpan={5} className="px-6 py-12 text-center">

                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />

                        <p className="text-gray-500 text-sm">ไม่พบสินค้า</p>

                      </td>

                    </tr>

                  ) : (

                    products.map((product) => (

                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">

                        <td className="px-6 py-4 whitespace-nowrap">

                          <div className="flex items-center gap-3">

                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">

                              {product.imgUrl ? (

                                <img

                                  src={product.imgUrl}

                                  alt={product.name}

                                  className="w-full h-full object-cover"

                                />

                              ) : (

                                <div className="w-full h-full flex items-center justify-center">

                                  <Package className="w-6 h-6 text-gray-400" />

                                </div>

                              )}

                            </div>

                            <div className="min-w-0">

                              <p className="text-sm font-medium text-gray-900 truncate">

                                {product.name}

                              </p>

                              <p className="text-xs text-gray-500 truncate">

                                ID: {product.id.substring(0, 8)}

                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <span className="text-sm font-medium text-gray-900">

                            ฿{product.price.toLocaleString()}

                          </span>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <span

                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${

                              product.stock > 10

                                ? "bg-green-100 text-green-800"

                                : product.stock > 0

                                ? "bg-yellow-100 text-yellow-800"

                                : "bg-red-100 text-red-800"

                            }`}

                          >

                            {product.stock} ชิ้น

                          </span>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">

                          <span className="text-sm text-gray-600">

                            {getCategoryNameById(product.categoryId)}

                          </span>

                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">

                          <div className="flex items-center justify-end gap-2">

                            <Link href={`/admin/products/${product.id}/edit`}>

                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">

                                <Edit2 className="w-4 h-4" />

                              </button>

                            </Link>

                            <button

                              onClick={() => handleDelete(product.id)}

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

                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, backendTotalPages))}

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

  

  export default AdminProductListPage;

  