"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/UserContext";

const AdminHeader = () => {
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("logoutEvent")); // Dispatch custom event for global state update
    router.push("/login");
  };

  return (
    <header className="bg-white shadow p-4 flex justify-end items-center">
      <div className="flex items-center space-x-4">
        {user ? (
          <span className="text-gray-700">Welcome, {user.username || user.email}</span>
        ) : (
          <span className="text-gray-700">Admin User</span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
        >
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
