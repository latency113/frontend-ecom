"use client";

import { getProductById, updateProduct } from "@/lib/api/admin/products";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { Product } from "@/types/product";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/lib/api/admin/categories";
import { Category } from "@/types/category";
import { ArrowLeft, Upload, X, Package, Plus } from "lucide-react";

const AdminProductEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState<Partial<Product>>({
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
  const [existingGallery, setExistingGallery] = useState<{id: string, url: string}[]>([]);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        if (productData) {
          setFormData({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            originalPrice: productData.originalPrice,
            promotionStart: productData.promotionStart,
            promotionEnd: productData.promotionEnd,
            stock: productData.stock,
            imgUrl: productData.imgUrl,
            categoryId: productData.categoryId,
          });
          setImagePreviewUrl(productData.imgUrl || null);
          setExistingGallery(productData.images || []);
        } else {
          showToast("ไม่พบสินค้า", "error");
        }

        const categoriesResponse = await getAllCategories();
        if (Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else {
          showToast("API did not return an array for categories.", "error");
          setCategories([]);
        }
      } catch (err: any) {
        showToast(`เกิดข้อผิดพลาด: ${err.message || err.toString()}`, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndCategories();
  }, [productId, showToast]);

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedGalleryFiles((prev) => [...prev, ...newFiles]);
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setGalleryPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setSelectedGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files && e.target.files[0];
      if (file) {
        setSelectedFile(file);
        setImagePreviewUrl(URL.createObjectURL(file));
      } else {
        setSelectedFile(null);
        setImagePreviewUrl(formData.imgUrl || null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "price" || name === "stock" ? parseFloat(value) : value,
      }));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreviewUrl(formData.imgUrl || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      if (formData.name !== undefined)
        formDataToSend.append("name", formData.name);
      if (formData.description !== undefined)
        formDataToSend.append("description", formData.description);
      if (formData.price !== undefined)
        formDataToSend.append("price", formData.price.toString());
      if (formData.originalPrice !== undefined)
        formDataToSend.append("originalPrice", formData.originalPrice !== null ? formData.originalPrice.toString() : "");
      if (formData.promotionStart !== undefined)
        formDataToSend.append("promotionStart", formData.promotionStart || "");
      if (formData.promotionEnd !== undefined)
        formDataToSend.append("promotionEnd", formData.promotionEnd || "");
      if (formData.stock !== undefined)
        formDataToSend.append("stock", formData.stock.toString());
      if (formData.categoryId !== undefined)
        formDataToSend.append("categoryId", formData.categoryId);

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      selectedGalleryFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      await updateProduct(productId, formDataToSend);
      showToast("อัพเดทสินค้าสำเร็จ!", "success");
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Error updating product:", err);
      showToast(`เกิดข้อผิดพลาด: ${err.message || err.toString()}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

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
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                แก้ไขสินค้า
              </h1>
              <p className="text-sm text-gray-500">{formData.name}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="p-6 space-y-6">
            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ชื่อสินค้า <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="ระบุชื่อสินค้า"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                รายละเอียด <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
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
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ราคาขาย (บาท) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || 0}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="originalPrice"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ราคาปกติ (ถ้ามีลดราคา)
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice || ""}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Promotion Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="promotionStart" className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่เริ่มโปรโมชั่น
                </label>
                <input
                  type="date"
                  id="promotionStart"
                  name="promotionStart"
                  value={formData.promotionStart ? formData.promotionStart.substring(0, 10) : ""}
                  onChange={(e) => {
                    const val = e.target.value ? new Date(e.target.value + "T00:00:00Z").toISOString() : null;
                    setFormData(prev => ({ ...prev, promotionStart: val }));
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="promotionEnd" className="block text-sm font-medium text-gray-700 mb-2">
                  วันที่สิ้นสุดโปรโมชั่น
                </label>
                <input
                  type="date"
                  id="promotionEnd"
                  name="promotionEnd"
                  value={formData.promotionEnd ? formData.promotionEnd.substring(0, 10) : ""}
                  onChange={(e) => {
                    const val = e.target.value ? new Date(e.target.value + "T23:59:59Z").toISOString() : null;
                    setFormData(prev => ({ ...prev, promotionEnd: val }));
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  จำนวนสต็อก <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock || 0}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  หมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId || ""}
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
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รูปภาพสินค้า
              </label>

              {imagePreviewUrl ? (
                <div className="relative">
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                  <label
                    htmlFor="image"
                    className="mt-2 inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    เปลี่ยนรูปภาพ
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">คลิกเพื่ออัพโหลด</span>{" "}
                      หรือลากไฟล์มาวาง
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF ขนาดไม่เกิน 10MB
                    </p>
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
              )}
            </div>

            {/* Gallery Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รูปภาพเพิ่มเติม (หลายมุมมอง)
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {/* Existing Images */}
                {existingGallery.map((img) => (
                  <div key={img.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={img.url} 
                      alt="Existing Gallery" 
                      className="object-contain w-full h-full"
                    />
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/50 text-white text-[10px] rounded">
                      เดิม
                    </div>
                  </div>
                ))}

                {/* New Previews */}
                {galleryPreviewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={url} 
                      alt={`New Gallery Preview ${index}`} 
                      className="object-contain w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 p-1 bg-white/80 rounded-full shadow-sm hover:bg-white transition-colors"
                    >
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                ))}
                
                {existingGallery.length + galleryPreviewUrls.length < 10 && (
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                    <Plus className="w-6 h-6 text-gray-400" />
                    <span className="text-[10px] text-gray-500 mt-1">เพิ่มรูป</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500">สามารถเพิ่มได้สูงสุด 10 รูป</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductEditPage;
