"use client";

import { useParams, useRouter } from "next/navigation";
import ProductDetail from "@/components/product/ProductDetail";
import { ArrowLeftIcon } from "lucide-react";

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  if (!productId) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading product...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-4 px-4 py-2 rounded border-b hover:bg-gray-200 text-gray-700"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        ย้อนกลับ
      </button>

      <ProductDetail productId={productId} />
    </div>
  );
};

export default ProductDetailPage;
