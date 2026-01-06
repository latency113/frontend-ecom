"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/lib/api/products";
import { getAllCategories } from "@/lib/api/categories";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import ProductCard from "@/components/product/ProductCard";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import Link from "next/link";
import { useRouter } from "next/navigation"; // Add useRouter

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(1, 100), // Request page 1, limit 100 products for default view
          getAllCategories(),
        ]);
        setProducts(productsData);
        // Ensure categoriesData includes a fallback for products without a categoryId
        const processedCategories = categoriesData; // No need to add empty products array to categories here
        setCategories(processedCategories);
      } catch (err: any) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const productsToProcess = products.filter((product) => {
    const matchesSearchTerm = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesSearchTerm;
  });

  const productsByCategory: { [key: string]: Product[] } = {};
  const uncategorizedProducts: Product[] = [];

  productsToProcess.forEach((product) => {
    if (product.categoryId) {
      if (!productsByCategory[product.categoryId]) {
        productsByCategory[product.categoryId] = [];
      }
      productsByCategory[product.categoryId].push(product);
    } else {
      uncategorizedProducts.push(product);
    }
  });

  // Determine which categories to display
  const categoriesToDisplay = categories.filter(
    (category) =>
      productsByCategory[category.id] &&
      productsByCategory[category.id].length > 0
  );

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading products...
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
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
        สินค้าทั้งหมด
      </h1>

      {categoriesToDisplay.map((category) => {
        const categoryProducts = productsByCategory[category.id];
        if (categoryProducts && categoryProducts.length > 0) {
          const productsToShow = categoryProducts.slice(0, 4); // Limit to 4

          return (
            <div key={category.id} className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
                {category.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {productsToShow.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {categoryProducts.length > 4 && (
                <div className="text-center mt-6">
                  <Link
                    href={`/category/${category.id}`}
                    className="inline-block px-6 py-2 border border-gray-900 text-gray-900 text-sm tracking-wide hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    ดูสินค้าทั้งหมดใน {category.name} ({categoryProducts.length} ชิ้น)
                  </Link>
                </div>
              )}
            </div>
          );
        }
        return null;
      })}

      {uncategorizedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
            สินค้าอื่น ๆ
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {uncategorizedProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {uncategorizedProducts.length > 4 && (
            <div className="text-center mt-6">
              <Link
                href={`/category/uncategorized`} // Assuming 'uncategorized' is a valid category ID or special route
                className="inline-block px-6 py-2 border border-gray-900 text-gray-900 text-sm tracking-wide hover:bg-gray-900 hover:text-white transition-colors"
              >
                ดูสินค้าอื่น ๆ ทั้งหมด ({uncategorizedProducts.length} ชิ้น)
              </Link>
            </div>
          )}
        </div>
      )}

      {productsToProcess.length === 0 && !loading && !error && (
        <p className="text-center py-10 text-gray-600 text-lg">ไม่พบสินค้า</p>
      )}
    </div>
  );
};
export default ProductsPage;
