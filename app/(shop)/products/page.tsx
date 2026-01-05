"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/lib/api/products";
import { getAllCategories } from "@/lib/api/categories";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import ProductCard from "@/components/product/ProductCard";
import { useSearchParams } from "next/navigation"; // Import useSearchParams

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");
  const selectedCategoryId = searchParams.get("category"); // Get the 'category' query parameter

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
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

  // Filter products based on search term and selected category
  const productsToProcess = products.filter((product) => {
    const matchesSearchTerm = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory = selectedCategoryId
      ? product.categoryId === selectedCategoryId
      : true;

    return matchesSearchTerm && matchesCategory;
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
  const categoriesToDisplay = selectedCategoryId
    ? categories.filter((category) => category.id === selectedCategoryId)
    : categories.filter(
        (category) =>
          productsByCategory[category.id] &&
          productsByCategory[category.id].length > 0
      );

  // If a specific category is selected but has no products, show all categories that have products.
  // This handles cases where a search term might filter out all products from a selected category.
  if (
    selectedCategoryId &&
    categoriesToDisplay.length === 0 &&
    productsToProcess.length > 0
  ) {
    // This case means a category was selected, but the search term filtered out all products.
    // We should probably just show all search-filtered products without category grouping if this happens.
    // Or just show nothing. For now, let's keep showing only the selected category if it has products.
    // If it has no products, the map will return null.
  }

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
        {selectedCategoryId
          ? categories.find((c) => c.id === selectedCategoryId)?.name ||
            "Category Products"
          : "สินค้าทั้งหมด"}
      </h1>

      {categoriesToDisplay.map((category) => {
        const categoryProducts = productsByCategory[category.id];
        if (categoryProducts && categoryProducts.length > 0) {
          return (
            <div key={category.id} className="mb-12">
              {!selectedCategoryId && ( // Only show category heading if not filtered by a single category
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
                  {category.name}
                </h2>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        }
        return null;
      })}

      {!selectedCategoryId && uncategorizedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
            สินค้าอื่น ๆ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {uncategorizedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {productsToProcess.length === 0 && !loading && !error && (
        <p className="text-center py-10 text-gray-600 text-lg">ไม่พบสินค้า</p>
      )}
    </div>
  );
};
export default ProductsPage;
