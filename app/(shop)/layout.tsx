// app/(shop)/layout.tsx
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto p-6 md:p-8 flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
