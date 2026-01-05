import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/lib/context/UserContext";
import { ToastProvider } from "@/components/ui/Toast/ToastProvider";

export const metadata: Metadata = {
  title: "IT Life Store",
  description: "A modern e-commerce application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ToastProvider>
          <UserProvider>
            <main className="flex-grow bg-white">
              {children}
            </main>
          </UserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}