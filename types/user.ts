export interface User {
  id: string;
  fullName:string
  username: string;
  email: string;
  role: "ADMIN" | "USER";
  address?: string;
  phone?: string;
}
