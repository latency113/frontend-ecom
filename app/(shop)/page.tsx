"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/lib/api/categories";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { getAllProducts } from "@/lib/api/products";
import ProductCard from "@/components/product/ProductCard";
import { Cpu, Truck, ShieldCheck, Headphones, Zap, Mail, Phone } from "lucide-react";
import Image from "next/image";

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <Image
          src="/assets/background.png"
          alt="IT Life Store Hero Background"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-md">
            Welcome to <span className="text-blue-500">IT Life Store</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-10 font-light">
            ร้านค้าอุปกรณ์คอมพิวเตอร์ที่มีคุณภาพสูงและบริการที่ยอดเยี่ยม สำหรับชีวิตดิจิทัลของคุณ
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="px-10 py-4 bg-blue-600 text-white rounded-sm font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              เริ่มช้อปปิ้งเลย
            </Link>
            <Link
              href="/categories"
              className="px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-sm font-semibold hover:bg-white/20 transition-all"
            >
              ดูหมวดหมู่ทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-sm flex items-center justify-center mb-4">
                <Truck size={24} />
              </div>
              <h3 className="font-semibold text-gray-900">จัดส่งรวดเร็ว</h3>
              <p className="text-sm text-gray-500">ส่งถึงมือคุณภายใน 1-3 วัน</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-sm flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-semibold text-gray-900">ประกันศูนย์แท้</h3>
              <p className="text-sm text-gray-500">มั่นใจในคุณภาพสินค้าทุกชิ้น</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-sm flex items-center justify-center mb-4">
                <Headphones size={24} />
              </div>
              <h3 className="font-semibold text-gray-900">บริการ 24/7</h3>
              <p className="text-sm text-gray-500">ทีมงานพร้อมดูแลคุณตลอดเวลา</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-sm flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="font-semibold text-gray-900">ราคาดีที่สุด</h3>
              <p className="text-sm text-gray-500">คุ้มค่าทุกการใช้จ่ายของคุณ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">หมวดหมู่แนะนำ</h2>
            <p className="text-gray-500">เลือกดูสินค้าตามประเภทที่ต้องการ</p>
          </div>
          <Link href="/categories" className="text-blue-600 hover:underline font-medium">
            ดูทั้งหมด &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group relative h-48 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"
            >
              <Cpu className="absolute w-32 h-32 text-blue-500 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500" />
              <h3 className="relative z-10 text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="relative rounded-3xl overflow-hidden bg-blue-600 h-64 md:h-80 flex items-center">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
             <Cpu size={300} className="text-white" />
          </div>
          <div className="relative z-10 px-8 md:px-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              อัปเกรดคอมพิวเตอร์ของคุณวันนี้ รับส่วนลดพิเศษ!
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              พบกับโปรโมชั่นอุปกรณ์เสริมและชิ้นส่วนคอมพิวเตอร์ ลดสูงสุดถึง 30% เฉพาะสัปดาห์นี้เท่านั้น
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              ช้อปโปรโมชั่นเลย
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">สินค้าแนะนำสำหรับคุณ</h2>
            <p className="text-gray-500">สินค้าขายดีและรุ่นล่าสุดที่ทีมงานคัดสรรมาเพื่อคุณ</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Link
              href="/products"
              className="inline-block px-12 py-4 bg-gray-900 text-white font-semibold rounded-sm hover:bg-black transition-all shadow-lg hover:shadow-gray-400/50"
            >
              ดูสินค้าทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      {/* Help & Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-sm p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
             <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 right-10 w-64 h-64 border-8 border-white rounded-sm" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 border-8 border-white rounded-sm" />
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
               <div>
                 <h2 className="text-3xl md:text-5xl font-bold mb-6">ต้องการความช่วยเหลือ ในการเลือกซื้อ?</h2>
                 <p className="text-blue-100 mb-10 text-lg md:text-xl leading-relaxed">
                   ทีมงานผู้เชี่ยวชาญของเราพร้อมให้คำปรึกษาและช่วยคุณเลือกอุปกรณ์ที่เหมาะสมที่สุด 
                   ไม่ว่าจะเป็นสำหรับการทำงาน เล่นเกม หรือการใช้งานทั่วไป
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4">
                   <Link 
                     href="/term/contacts"
                     className="px-10 py-4 bg-white text-blue-600 font-bold rounded-sm hover:bg-gray-100 transition-all text-center"
                   >
                     ติดต่อเราตอนนี้
                   </Link>
                   <a 
                     href="tel:062-969-9399"
                     className="px-10 py-4 bg-blue-700 text-white font-bold rounded-sm hover:bg-blue-800 transition-all text-center flex items-center justify-center gap-2"
                   >
                     <Phone size={20} />
                     062-969-9399
                   </a>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="bg-white/10 backdrop-blur-md p-6 rounded-sm border border-white/20">
                   <h3 className="font-bold text-xl mb-2">แชทกับเรา</h3>
                   <p className="text-blue-100 text-sm mb-4">คุยกับเราผ่านช่องทางออนไลน์ ตอบกลับรวดเร็วภายใน 15 นาที</p>
                   <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-sm">Online Now</span>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md p-6 rounded-sm border border-white/20">
                   <h3 className="font-bold text-xl mb-2">เช็คสถานะการส่ง</h3>
                   <p className="text-blue-100 text-sm">ติดตามพัสดุของคุณได้ง่ายๆ เพียงใช้หมายเลขคำสั่งซื้อ</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md p-6 rounded-sm border border-white/20">
                   <h3 className="font-bold text-xl mb-2">ประกันสินค้า</h3>
                   <p className="text-blue-100 text-sm">สอบถามข้อมูลการเคลมและเงื่อนไขการรับประกันสินค้า</p>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md p-6 rounded-sm border border-white/20">
                   <h3 className="font-bold text-xl mb-2">ร่วมงานกับเรา</h3>
                   <p className="text-blue-100 text-sm">สนใจร่วมเป็นส่วนหนึ่งของทีม IT Life Store ดูตำแหน่งที่เปิดรับ</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
