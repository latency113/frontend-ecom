"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCategoryById, getProductsByCategoryId } from "@/lib/api/categories";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import { ArrowLeftIcon } from "lucide-react";

const CategoryDetailPage = () => {
  const params = useParams();
  const categoryId = params.id as string;
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await getCategoryById(categoryId);
        setCategory(categoryData);
        const productsData = await getProductsByCategoryId(categoryId, 1, 1000); // Request page 1, limit 1000 products
        setProducts(productsData);
      } catch (err: any) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading category...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 text-lg">
        Error: {error}
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Category not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6 tracking-tight">
        {category.name}
      </h1>
      <p className="text-lg text-center text-gray-700 mb-10 max-w-2xl mx-auto">
        {category.description}
      </p>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-4 px-4 py-2 rounded border-b hover:bg-gray-200 text-gray-700"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        ย้อนกลับ
      </button>
      {products.length === 0 ? (
        <p className="text-center py-10 text-gray-600 text-lg">
          ไม่พบสินค้าในหมวดหมู่นี้
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDetailPage;
