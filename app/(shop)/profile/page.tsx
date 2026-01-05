"use client";

import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";
import { LogIn, User, ShoppingBag, Heart, MapPin, CreditCard,  } from "lucide-react";
import { usePathname } from "next/navigation";

const ProfilePage = () => {
  const { user, loading: loadingUser, error: userError } = useUser();
  const pathname = usePathname();

  if (loadingUser) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        กำลังโหลด...
      </div>
    );
  }

  if (userError) {
    return (
      <div className="text-center py-20 text-blue-500 text-lg">
        Error: {userError}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-700 mb-6">
          เข้าสู่ระบบเพื่อจัดการโปรไฟล์
        </p>
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 gap-2 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <LogIn className="w-5 h-5" />
          เข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">ข้อมูลส่วนตัว</h1>
                </div>
                <button className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                  แก้ไขข้อมูลส่วนตัว
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex items-start gap-6 mb-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {user.username || user.email}
                  </h2>
                  <div className="flex gap-8 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-500">เลิร์จสิน</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-500">จัดส่งแล้ว</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-500">รอดำเนินการ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-500">รอชำระเงิน</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Details Table */}
              <div className="border-t pt-6">
                <table className="w-full">
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-4 text-sm text-gray-500 w-48">ชื่อ - นามสกุล</td>
                      <td className="py-4 text-sm text-gray-900">
                        {user.fullName}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 text-sm text-gray-500">อีเมล</td>
                      <td className="py-4 text-sm text-gray-900">
                        {user.email}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 text-sm text-gray-500">หมายเลขโทรศัพท์</td>
                      <td className="py-4 text-sm text-gray-900">{user.phone}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;