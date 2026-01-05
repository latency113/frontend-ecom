import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth - E-commerce Store",
  description: "Authentication pages for the E-commerce application",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  console.log("Using AuthLayout"); // ดูใน terminal ที่รัน Next.js

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900">
      <div className="bg-white px-6 py-8 shadow-xl w-full sm:max-w-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
