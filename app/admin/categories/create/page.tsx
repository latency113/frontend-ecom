"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types/category";
import { createCategory } from "@/lib/api/admin/categories";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { ArrowLeft, FolderTree } from "lucide-react";

const AdminCategoryCreatePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Category, "id">>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCategory(formData);
      showToast("สร้างหมวดหมู่สำเร็จ!", "success");
      router.push("/admin/categories");
    } catch (err: any) {
      console.error("Error creating category:", err);
      showToast(`เกิดข้อผิดพลาด: ${err.message || err.toString()}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <FolderTree className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              เพิ่มหมวดหมู่ใหม่
            </h1>
          </div>
          <p className="text-sm text-gray-600 ml-13">
            กรอกข้อมูลหมวดหมู่ให้ครบถ้วน
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="p-6 space-y-6">
            {/* Category Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ชื่อหมวดหมู่ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="ระบุชื่อหมวดหมู่"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                รายละเอียด
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors resize-none"
                placeholder="อธิบายรายละเอียดหมวดหมู่ (ไม่บังคับ)"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/categories")}
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
              {loading ? "กำลังสร้าง..." : "สร้างหมวดหมู่"}
            </button>
          </div>
        </form>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                คำแนะนำ
              </h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• ใช้ชื่อหมวดหมู่ที่สั้นและกระชับ</li>
                <li>• รายละเอียดช่วยให้ลูกค้าเข้าใจหมวดหมู่มากขึ้น</li>
                <li>• สามารถแก้ไขข้อมูลได้ภายหลัง</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryCreatePage;
