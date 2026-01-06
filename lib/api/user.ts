import api from "./index";
import { User } from "@/types/user";

export const updateProfile = async (userId: string, data: Partial<User>): Promise<User> => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/users/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
