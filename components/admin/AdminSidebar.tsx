"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users 
} from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { 
      name: "หน้าแรก", 
      href: "/admin", 
      icon: LayoutDashboard 
    },
    { 
      name: "จัดการสินค้า", 
      href: "/admin/products", 
      icon: Package 
    },
    { 
      name: "จัดการหมวดหมู่", 
      href: "/admin/categories", 
      icon: FolderTree 
    },
    { 
      name: "จัดการคำสั่งซื้อ", 
      href: "/admin/orders", 
      icon: ShoppingCart 
    },
    { 
      name: "จัดการผู้ใช้", 
      href: "/admin/users", 
      icon: Users 
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-500 mt-1">Management System</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3 px-2">
            Main Menu
          </h3>
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? "border-b-2 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-gray-900" : "text-gray-500"}`} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;