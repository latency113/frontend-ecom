import api from "./index";
import { Address, CreateAddressPayload, UpdateAddressPayload } from "@/types/address";

export const getAddressesByUserId = async (): Promise<Address[]> => {
  try {
    const response = await api.get(`/addresses`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const createAddress = async (payload: CreateAddressPayload): Promise<Address> => {
  try {
    const response = await api.post(`/addresses`, payload);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const updateAddress = async (id: string, payload: UpdateAddressPayload): Promise<Address> => {
  try {
    const response = await api.put(`/addresses/${id}`, payload);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const deleteAddress = async (id: string): Promise<void> => {
  try {
    await api.delete(`/addresses/${id}`);
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
