"use client";

import { useState } from "react";
import { register } from "@/lib/api/auth";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullname] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await register(username, email, password, fullName);
      console.log("Registration successful:", userData);
      showToast("Registration successful! Please log in.", "success");
      router.push("/login"); // Redirect to login after successful registration
    } catch (err: any) {
      console.error("Registration failed:", err);
      showToast(`Registration failed: ${err.message || err.toString()}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          ชื่อผู้ใช้
        </label>
        <input
          type="text"
          id="username"
          className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          ชื่อ-นามสกุล
        </label>
        <input
          type="text"
          id="fullName"
          className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={fullName}
          onChange={(e) => setFullname(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          อีเมล
        </label>
        <input
          type="email"
          id="email"
          className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="relative">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          รหัสผ่าน
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          className="text-black block w-full px-4 pr-10 py-2 border border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-sm shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
      </button>
      <p className="mt-4 text-center text-sm text-gray-600">
        มีบัญชีอยู่แล้ว?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          เข้าสู่ระบบเลย
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
