// app/(shop)/layout.tsx
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Suspense } from 'react'; // Import Suspense

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 flex-grow">
        <Suspense fallback={<div>Loading...</div>}> {/* Wrap children with Suspense */}
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
