"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAllProducts } from "@/lib/api/products";
import { getAllCategories } from "@/lib/api/categories";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import ProductCard from "@/components/product/ProductCard";
import { ArrowLeftIcon } from "lucide-react";

const CategoryProductsPage = () => {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const fetchCategoryProducts = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(1, 100), // Fetch all products initially
          getAllCategories(),
        ]);

        const selectedCategory = categoriesData.find((cat: Category) => cat.id === categoryId);
        if (selectedCategory) {
          setCategoryName(selectedCategory.name);
          const filteredProducts = productsData.filter(
            (product: Product) => product.categoryId === categoryId
          );
          setProducts(filteredProducts);
        } else {
          setError("Category not found.");
          setProducts([]);
        }
      } catch (err: any) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading category products...
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

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-4 px-4 py-2 rounded border-b hover:bg-gray-200 text-gray-700"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        ย้อนกลับ
      </button>

      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
        {categoryName || "Category Products"}
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center py-10 text-gray-600 text-lg">
          ไม่พบสินค้าในหมวดหมู่นี้
        </p>
      )}
    </div>
  );
};

export default CategoryProductsPage;
