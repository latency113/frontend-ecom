"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";
import { updateProfile } from "@/lib/api/user"; // Assume this API function exists or will be created
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { ArrowLeft, Save, User, Mail, Phone } from "lucide-react";

const EditProfilePage = () => {
  const { user, updateUser } = useUser();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id) throw new Error("User not found");
      
      const updatedUser = await updateProfile(user.id, formData);
      updateUser(updatedUser); // Update context and localStorage
      showToast("อัพเดทข้อมูลส่วนตัวสำเร็จ!", "success");
      router.push("/profile");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      showToast(`เกิดข้อผิดพลาด: ${err.message || err.toString()}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">แก้ไขข้อมูลส่วนตัว</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              ชื่อ - นามสกุล
            </div>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              อีเมล
            </div>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 text-gray-500 cursor-not-allowed"
            disabled // Email usually shouldn't be editable directly without verification
            title="ไม่สามารถแก้ไขอีเมลได้"
          />
          <p className="mt-1 text-xs text-gray-500">อีเมลไม่สามารถแก้ไขได้</p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              หมายเลขโทรศัพท์
            </div>
          </label>
          <input
            maxLength={10}
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0xxxxxxxxx"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <Save className="w-4 h-4" />
            {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
