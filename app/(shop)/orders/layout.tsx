"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserCircle,
  MapPin,
  ListOrdered,
} from "lucide-react"; // Import necessary icons

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    {
      icon: ListOrdered,
      label: "คำสั่งซื้อของฉัน",
      href: "/orders",
    },
    {
      icon: MapPin,
      label: "ที่อยู่สำหรับจัดส่ง",
      href: "/profile/addresses",
    },
    // Add more menu items as needed
  ];

  const accountItems = [
    {
      icon: UserCircle,
      label: "ข้อมูลส่วนตัว",
      href: "/profile", // Link to the main profile page
    },
    // {
    //   icon: Settings,
    //   label: "การตั้งค่าบัญชี",
    //   href: "/profile/settings",
    // },
    // {
    //   icon: LogOut,
    //   label: "ออกจากระบบ",
    //   href: "/logout", // This would trigger a logout function
    // },
  ];

  return (
    <div className="container mx-auto py-0 md:py-8 px-0 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h3 className="text-sm text-gray-500 mb-3 font-medium">รายการ</h3>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    pathname === item.href
                      ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600 -ml-4 pl-5"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm text-gray-500 mb-3 font-medium">บัญชี</h3>
            <nav className="space-y-1">
              {accountItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    pathname === item.href
                      ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600 -ml-4 pl-5"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-grow min-w-0">{children}</main>
      </div>
    </div>
  );
}
