export interface User {
  id: string;
  fullName:string
  username: string;
  email: string;
  role: "ADMIN" | "USER";
  address?: string;
  phone?: string;
}

export interface CreateUserPayload {
  fullName?: string;
  username: string;
  email: string;
  password?: string; // Password is required for creation, but can be optional if system allows admin to set it later
  role: "ADMIN" | "USER";
  address?: string;
  phone?: string;
}
