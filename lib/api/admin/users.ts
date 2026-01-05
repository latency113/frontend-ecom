import { User, CreateUserPayload } from "@/types/user";
import api from "../index";

export const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = "",
  roleFilter: string = "all"
): Promise<{
  data: User[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}> => {
  try {
    const params: any = { page, limit };
    if (searchTerm) params.searchTerm = searchTerm;
    if (roleFilter !== "all") params.roleFilter = roleFilter;

    const response = await api.get("/users", { params });
    return response.data; // Assuming backend returns { data: [], totalCount: N, ... }
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${id}`);

    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const createUser = async (userData: CreateUserPayload): Promise<User> => {
  try {
    const response = await api.post("/users", userData);

    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  try {
    const response = await api.put(`/users/${id}`, userData);

    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
