"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";
import { createProduct } from "@/lib/api/admin/products";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { getAllCategories } from "@/lib/api/admin/categories";
import { Category } from "@/types/category";
import { ArrowLeft, Upload, X, ImageIcon } from "lucide-react";

const AdminProductCreatePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imgUrl: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          showToast("API did not return an array for categories.", "error");
          setCategories([]);
        }
      } catch (err: any) {
        showToast(`Error fetching categories: ${err.message || err.toString()}`, "error");
      }
    };
    fetchCategories();
  }, [showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;

    if (name === "image") {
      const file = files && files[0];
      if (file) {
        setSelectedFile(file);
        setImagePreviewUrl(URL.createObjectURL(file));
      } else {
        setSelectedFile(null);
        setImagePreviewUrl(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: (name === "price" || name === "stock") ? parseFloat(value) : value,
      }));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("stock", formData.stock.toString());
      formDataToSend.append("categoryId", formData.categoryId);

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      } else {
        showToast("กรุณาอัพโหลดรูปภาพสินค้า", "error");
        setLoading(false);
        return;
      }
      
      await createProduct(formDataToSend);
      showToast("สร้างสินค้าสำเร็จ!", "success");
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Error creating product:", err);
      showToast(`เกิดข้อผิดพลาด: ${err.message || err.toString()}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">ย้อนกลับ</span>
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            เพิ่มสินค้าใหม่
          </h1>
          <p className="text-sm text-gray-600">กรอกข้อมูลสินค้าให้ครบถ้วน</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อสินค้า <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="ระบุชื่อสินค้า"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                รายละเอียด <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors resize-none"
                placeholder="อธิบายรายละเอียดสินค้า"
                required
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  ราคา (บาท) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  จำนวนสต็อก <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                หมวดหมู่ <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors appearance-none bg-white"
                required
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รูปภาพสินค้า <span className="text-red-500">*</span>
              </label>
              
              {!imagePreviewUrl ? (
                <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">คลิกเพื่ออัพโหลด</span> หรือลากไฟล์มาวาง
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF ขนาดไม่เกิน 10MB</p>
                  </div>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <Image 
                      src={imagePreviewUrl} 
                      alt="Preview" 
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "กำลังสร้าง..." : "สร้างสินค้า"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductCreatePage;