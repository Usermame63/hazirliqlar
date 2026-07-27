import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingEditor from "../components/FloatingEditor";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hazırlıqlar - Müəllim Tap",
  description: "Özünüzə ən yaxın və ən uyğun hazırlıq müəllimini xəritədə tapın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}>
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>

        <Footer />

        {/* Canlı Redaktə (Live Edit) Paneli - Yalnız URL-də edit=true olanda ekrana çıxır */}
        <Suspense fallback={null}>
          <FloatingEditor />
        </Suspense>
        
      </body>
    </html>
  );
}