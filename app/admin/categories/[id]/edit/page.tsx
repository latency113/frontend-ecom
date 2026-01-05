"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Category } from "@/types/category";
import { getCategoryById, updateCategory } from "@/lib/api/admin/categories"; // Will use this for actual API call
import { useToast } from "@/components/ui/Toast/ToastProvider";

const AdminCategoryEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      try {
        setLoading(true);
        const data = await getCategoryById(categoryId);
        if (data) {
          setFormData({
            name: data.name,
            description: data.description,
          });
        } else {
          showToast("Category not found.", "error");
        }
      } catch (err: any) {
        showToast(`Error fetching category: ${err.message || err.toString()}`, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [categoryId, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateCategory(categoryId, formData);
      console.log("Updating category with ID", categoryId, "and data:", formData);
      showToast("Category updated successfully!", "success");
      router.push("/admin/categories"); // Redirect to category list after update
    } catch (err: any) {
      console.error("Error updating category:", err);
      showToast(`Error updating category: ${err.message || err.toString()}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-600 text-lg">Loading category...</div>;
  }

  // The error state is now managed by showToast, so this div can be removed or simplified
  // if (error && !formData.name) {
  //   return <div className="text-center py-20 text-red-500 text-lg">Error: {error}</div>;
  // }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Category: {formData.name || categoryId}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-none border border-gray-200 max-w-lg mx-auto">
        {/* Error and Success messages are now handled by toast */}

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Category Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={4}
            className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
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
            onClick={() => router.push("/admin/categories")}
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

export default AdminCategoryEditPage;
