"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Grid2X2,
  Home,
  ShoppingBag,
  Phone,
  Info,
} from "lucide-react";
import { getAllCategories } from "@/lib/api/categories"; // Import getAllCategories
import { Category } from "@/types/category"; // Import Category type
import { User } from "@/types/user"; // Import User type

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]); // State for categories
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for click outside logic
  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    checkUser();
    fetchCategories(); // Fetch categories on mount
    window.addEventListener("loginEvent", checkUser);

    return () => {
      window.removeEventListener("loginEvent", checkUser);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/category/${categoryId}`);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="relative">
      <div className="flex items-center justify-between">
        {/* Desktop Nav Container */}
        <div className="hidden md:flex items-center gap-8 w-full">
          {/* Categories Dropdown (Desktop) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium"
            >
              <Grid2X2
                className={`w-5 h-5 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-90" : ""
                }`}
              />
              หมวดหมู่สินค้า
            </button>
            <div
              className={`absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20
                      transform origin-top transition-all duration-300 ease-in-out
                      ${
                        isDropdownOpen
                          ? "opacity-100 scale-y-100"
                          : "opacity-0 scale-y-0 pointer-events-none"
                      }`}
              style={{ visibility: isDropdownOpen ? "visible" : "hidden" }}
            >
              <Link
                href="/products"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                สินค้าทั้งหมด
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              {categories.map((category) => (
                <a
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>

          {/* Main Navigation Links */}
          <ul className="flex items-center gap-8 text-sm">
            <li>
              <Link href="/" className="text-gray-700 hover:text-blue-700">
                หน้าแรก
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="text-gray-700 hover:text-blue-700"
              >
                สินค้าทั้งหมด
              </Link>
            </li>
            <li>
              <Link
                href="/term/contacts"
                className="text-gray-700 hover:text-blue-700"
              >
                ติดต่อเรา
              </Link>
            </li>
            <li>
              <Link
                href="/term/abouts"
                className="text-gray-700 hover:text-blue-700"
              >
                เกี่ยวกับเรา
              </Link>
            </li>
          </ul>

          {/* Auth Section */}
          <div className="ml-auto flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  สวัสดี, {user.username || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-700 hover:text-blue-700"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-700 hover:text-blue-700"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="text-sm text-gray-700 hover:text-blue-700"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex justify-around items-center h-16 px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 active:text-blue-600 w-16"
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px]">หน้าแรก</span>
        </Link>
        <Link
          href="/products"
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 active:text-blue-600 w-16"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px]">สินค้า</span>
        </Link>
        <Link
          href="/mobile-category-nav"
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 active:text-blue-600 w-16"
        >
          <Grid2X2 className="w-6 h-6" />
          <span className="text-[10px]">หมวดหมู่</span>
        </Link>
        <Link
          href="/term/contacts"
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 active:text-blue-600 w-16"
        >
          <Phone className="w-6 h-6" />
          <span className="text-[10px]">ติดต่อ</span>
        </Link>
        <Link
          href="/term/abouts"
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 active:text-blue-600 w-16"
        >
          <Info className="w-6 h-6" />
          <span className="text-[10px]">เกี่ยวกับ</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
