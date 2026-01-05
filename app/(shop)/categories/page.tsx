"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCategories } from "@/lib/api/categories";
import { Category } from "@/types/category";
import { CpuIcon } from "lucide-react";

const CategoriesPage = () => {
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
    return <div className="text-center mt-8">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">หมวดหมู่สินค้า</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <div className="block bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-full h-48 mb-4 overflow-hidden rounded-md">
                <CpuIcon className="w-full h-full text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
