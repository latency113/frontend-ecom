"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { User } from "@/types/user";
import { getUserById, updateUser } from "@/lib/api/admin/users";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { ArrowLeft, User as UserIcon, Mail, Shield, AlertTriangle } from "lucide-react";

const AdminUserEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [formData, setFormData] = useState<Partial<User>>({
    username: "",
    email: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const data = await getUserById(userId);
        if (data) {
          setFormData({
            username: data.username,
            email: data.email,
            role: data.role,
          });
        } else {
          showToast("ไม่พบผู้ใช้", "error");
        }
      } catch (err: any) {
        showToast(`เกิดข้อผิดพลาด: ${err.message || err.toString()}`, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateUser(userId, formData);
      showToast("อัพเดทผู้ใช้สำเร็จ!", "success");
      router.push("/admin/users");
    } catch (err: any) {
      console.error("Error updating user:", err);
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
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                แก้ไขข้อมูลผู้ใช้
              </h1>
              <p className="text-sm text-gray-500">{formData.username || formData.email}</p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลผู้ใช้</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">User ID</p>
                <p className="text-sm font-medium text-gray-900 break-all">{userId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  ชื่อผู้ใช้ <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="ระบุชื่อผู้ใช้"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  อีเมล <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  สิทธิ์การเข้าถึง <span className="text-red-500">*</span>
                </div>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors appearance-none bg-white"
              >
                <option value="USER">ผู้ใช้ทั่วไป (USER)</option>
                <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
              </select>
              <p className="mt-2 text-xs text-gray-500">
                ผู้ดูแลระบบสามารถเข้าถึงและจัดการข้อมูลทั้งหมดได้
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/users")}
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

        {/* Warning Card */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-amber-900 mb-1">คำเตือน</h3>
              <ul className="text-xs text-amber-800 space-y-1">
                <li>• การเปลี่ยนสิทธิ์เป็น ADMIN จะทำให้ผู้ใช้สามารถเข้าถึงข้อมูลทั้งหมดได้</li>
                <li>• การแก้ไขอีเมลอาจส่งผลต่อการเข้าสู่ระบบของผู้ใช้</li>
                <li>• ตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserEditPage;