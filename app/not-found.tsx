"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold text-blue-600 mb-2">404</h1>
      <h2 className="text-3xl font-semibold mb-2">ไม่พบหน้าที่ต้องการ</h2>
      <p className="text-lg text-center mb-8 max-w-md">
        ขออภัย! หน้าที่คุณกำลังมองหาไม่มีอยู่จริง
      </p>
      <Link href="/">
        <button className="flex gap-2 px-6 py-3 border-b-4 border-blue-500 text-blue-500 rounded-lg text-lg font-medium hover:bg-blue-700 hover:text-white transition-colors duration-200">
          <ArrowLeft />
          กลับไปหน้าแรก
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
