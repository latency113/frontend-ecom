"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, CreateUserPayload } from "@/types/user"; // Import CreateUserPayload
import { createUser } from "@/lib/api/admin/users"; // Will use this for actual API call
import { useToast } from "@/components/ui/Toast/ToastProvider";

const AdminUserCreatePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateUserPayload>({
    username: "",
    email: "",
    password: "", // Assuming password will be set on creation
    role: "USER", // Default role
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createUser(formData); // Placeholder for API call
      console.log("Creating user with data:", formData);
      showToast("User created successfully!", "success");
      router.push("/admin/users"); // Redirect to user list after creation
    } catch (err: any) {
      console.error("Error creating user:", err);
      showToast(`Error creating user: ${err.message || err.toString()}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create New User</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-none border border-gray-200 max-w-lg mx-auto">

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
            Role:
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserCreatePage;
