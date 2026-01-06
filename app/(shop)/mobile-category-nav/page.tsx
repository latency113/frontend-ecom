"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCategories } from "@/lib/api/categories";
import { Category } from "@/types/category";
import { ChevronRight } from "lucide-react";

const MobileCategoryNavPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err: any) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">กำลังโหลดหมวดหมู่...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">เกิดข้อผิดพลาด: {error}</div>;
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h1 className="text-xl font-bold text-gray-900">หมวดหมู่สินค้า</h1>
      </div>
      <div className="divide-y divide-gray-100">
        <Link
            href="/products"
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
            <span className="text-gray-800 font-medium">สินค้าทั้งหมด</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-800 font-medium">{category.name}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileCategoryNavPage;
