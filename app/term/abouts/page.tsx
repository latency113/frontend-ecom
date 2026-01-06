"use client";

import React from "react";
import { Target, ShieldCheck, Zap, Laptop } from "lucide-react";
import Link from "next/link";

const AboutsPage = () => {
  return (
    <div className="container mx-auto py-8 md:py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          เกี่ยวกับ IT Life Store
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          เราคือผู้นำเข้าและจัดจำหน่ายอุปกรณ์คอมพิวเตอร์และแกดเจ็ตที่ครบวงจรที่สุด
          มุ่งเน้นการส่งมอบนวัตกรรมใหม่ล่าสุดให้กับผู้ใช้งานในประเทศไทย
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">วิสัยทัศน์</h3>
          <p className="text-gray-600">
            เป็นร้านค้าไอทีอันดับหนึ่งที่ทุกคนนึกถึง
            เมื่อต้องการอุปกรณ์ที่มีคุณภาพและบริการที่เป็นเลิศ
          </p>
        </div>

        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            ความน่าเชื่อถือ
          </h3>
          <p className="text-gray-600">
            สินค้าทุกชิ้นเป็นของแท้ 100% พร้อมการรับประกันศูนย์ไทย
            และบริการหลังการขายที่รวดเร็ว
          </p>
        </div>

        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-6">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">ความรวดเร็ว</h3>
          <p className="text-gray-600">
            จัดส่งสินค้าถึงมือคุณอย่างรวดเร็วและปลอดภัย
            ด้วยระบบการจัดการคลังสินค้าที่ทันสมัย
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
        <div className="lg:w-1/2">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-24 h-24 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-video flex items-center justify-center relative">
              <img
                src="/assets/facebook.png"
                alt="IT Life Store Team"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="lg:w-1/2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            จุดเริ่มต้นของเรา
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
            <p>
              จากการเริ่มต้นเป็นร้านเล็กๆ
              เราได้เติบโตขึ้นอย่างรวดเร็วด้วยการบอกต่อของลูกค้า
              ที่ประทับใจในคุณภาพสินค้าและการดูแลเอาใจใส่ของเรา
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-blue-600">5k+</span>
                <span className="text-sm text-gray-500 uppercase">
                  ลูกค้าที่พอใจ
                </span>
              </div>
              <div className="flex flex-col border-l border-gray-200 pl-6">
                <span className="text-3xl font-bold text-blue-600">500+</span>
                <span className="text-sm text-gray-500 uppercase">
                  สินค้าที่มีคุณภาพ
                </span>
              </div>
              <div className="flex flex-col border-l border-gray-200 pl-6">
                <span className="text-3xl font-bold text-blue-600">24/7</span>
                <span className="text-sm text-gray-500 uppercase">
                  การสนับสนุนออนไลน์
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">เราพร้อมดูแลคุณทุกขั้นตอน</h2>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          ไม่ว่าคุณจะเป็นเกมเมอร์มืออาชีพ คนทำงานสายกราฟิก หรือผู้ใช้งานทั่วไป
          เรามีทีมงานผู้เชี่ยวชาญพร้อมให้คำปรึกษาในการเลือกซื้อสินค้าที่ตอบโจทย์คุณที่สุด
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/products">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              เริ่มช้อปปิ้งเลย
            </button>
          </Link>
          <Link href="/term/contacts">
            <button className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
              ติดต่อสอบถาม
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutsPage;
