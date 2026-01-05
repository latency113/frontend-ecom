import api from "./index";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", file); // Assuming the backend expects the file under the key "image"

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Frontend fileUpload.ts: Backend response for image upload:", response.data);
    return response.data.imageUrl; // Assuming the backend returns { imageUrl: "..." }
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
