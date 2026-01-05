"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { User } from "@/types/user";
import { getUserById, updateUser } from "@/lib/api/admin/users"; // Will use this for actual API call
import { useToast } from "@/components/ui/Toast/ToastProvider";

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
        const data = await getUserById(userId); // Use real API call
        if (data) {
          setFormData({
            username: data.username,
            email: data.email,
            role: data.role,
          });
        } else {
          showToast("User not found.", "error");
        }
      } catch (err: any) {
        showToast(`Error fetching user: ${err.message || err.toString()}`, "error");
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
      await updateUser(userId, formData); // Use real API call
      console.log("Updating user with ID", userId, "and data:", formData); // Keep console log for debugging
      showToast("User updated successfully!", "success");
      router.push("/admin/users"); // Redirect to user list after update
    } catch (err: any) {
      console.error("Error updating user:", err);
      showToast(`Error updating user: ${err.message || err.toString()}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-600 text-lg">Loading user...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit User: {formData.username || userId}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-none border border-gray-200 max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username || ""}
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
            value={formData.email || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            value={formData.role || ""}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUserEditPage;
