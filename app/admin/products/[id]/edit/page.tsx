"use client";

import { getProductById, updateProduct } from "@/lib/api/admin/products";
import { useToast } from "@/components/ui/Toast/ToastProvider";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/lib/api/admin/categories";
import { Category } from "@/types/category";

const AdminProductEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imgUrl: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        // Fetch product
        const productData = await getProductById(productId);
        if (productData) {
          setFormData({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            stock: productData.stock, // SET from fetched data
            imgUrl: productData.imgUrl,
            categoryId: productData.categoryId,
          });
          setImagePreviewUrl(productData.imgUrl || null);
        } else {
          showToast("Product not found.", "error");
        }

        // Fetch categories
        const categoriesResponse = await getAllCategories();
        if (Array.isArray(categoriesResponse.data)) {
          setCategories(categoriesResponse.data);
        } else {
          showToast("API did not return an array for categories.", "error");
          setCategories([]);
        }
      } catch (err: any) {
        showToast(`Error fetching data: ${err.message || err.toString()}`, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndCategories();
  }, [productId, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files && e.target.files[0];
      if (file) {
        setSelectedFile(file);
        setImagePreviewUrl(URL.createObjectURL(file));
      } else {
        setSelectedFile(null);
        // If file input is cleared, revert preview to existing imgUrl or null
        setImagePreviewUrl(formData.imgUrl || null); // Ensure it can be null
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: (name === "price" || name === "stock") ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      // Only append fields that might have changed
      if (formData.name !== undefined) formDataToSend.append("name", formData.name);
      if (formData.description !== undefined) formDataToSend.append("description", formData.description);
      if (formData.price !== undefined) formDataToSend.append("price", formData.price.toString());
      if (formData.stock !== undefined) formDataToSend.append("stock", formData.stock.toString());
      if (formData.categoryId !== undefined) formDataToSend.append("categoryId", formData.categoryId);

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      await updateProduct(productId, formDataToSend);
      console.log("Updating product with ID", productId, "and data:", formData);
      showToast("Product updated successfully!", "success");
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Error updating product:", err);
      showToast(`Error updating product: ${err.message || err.toString()}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-600 text-lg">Loading product...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Product: {formData.name || productId}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-none border border-gray-200 max-w-lg mx-auto">
        {/* Error and Success messages are now handled by toast */}

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Product Name:
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
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
            Price:
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price || 0}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">
            Stock:
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock || 0}
            onChange={handleChange}
            min="0"
            className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
            Product Image:
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {(imagePreviewUrl || formData.imgUrl) && (
            <div className="mt-4">
              <p className="block text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
              <img src={imagePreviewUrl || formData.imgUrl || ''} alt="Image Preview" width={128} height={128} className="object-cover rounded-md border border-gray-200" />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="categoryId" className="block text-gray-700 text-sm font-bold mb-2">
            Category:
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
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
            onClick={() => router.push("/admin/products")}
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

export default AdminProductEditPage;