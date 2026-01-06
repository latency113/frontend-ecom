"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/lib/api/categories";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { getAllProducts } from "@/lib/api/products";
import ProductCard from "@/components/product/ProductCard";
import { Cpu } from "lucide-react";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        // Shuffle and pick only 8 products
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 8));
      } catch (err: any) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-blue-500 mb-4">
            Welcome to IT Life Store
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            ร้านค้าอุปกรณ์คอมพิวเตอร์ที่มีคุณภาพสูงและบริการที่ยอดเยี่ยม
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-colors"
          >
            เริ่มช้อปปิ้งเลย
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="text-2xl sm:text-3xl font-light text-center mb-8 md:mb-12">
          เลือกหมวดหมู่ที่คุณชื่นชอบ
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group relative h-32 sm:h-40 bg-gray-100 hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center overflow-hidden rounded-lg"
            >
              <Cpu className="absolute w-24 h-24 sm:w-32 sm:h-32 text-gray-300 opacity-20 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="relative z-10 text-lg sm:text-2xl font-semibold text-gray-900 text-center px-2">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-light text-center mb-8 md:mb-12">
            สินค้าแนะนำสำหรับคุณ
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block px-8 py-3 border border-gray-900 text-gray-900 text-sm tracking-wide hover:bg-gray-900 hover:text-white transition-colors"
            >
              ดูสินค้าทั้งหมด
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
