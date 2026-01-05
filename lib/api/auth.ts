import api from "./index";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post(`/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const register = async (username: string, email: string, password: string, fullName: string) => {
  try {
    const response = await api.post(`/register`, { username, email, password, fullName });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
