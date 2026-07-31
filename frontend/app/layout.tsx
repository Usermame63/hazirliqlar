import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingEditor from "../components/FloatingEditor";
import BottomNav from "../components/BottomNav"; // 1. İMPORT ƏLAVƏ EDİLDİ
import AppLock from "../components/AppLock"; // 3. APPLOCK İMPORT EDİLDİ
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
        
        {/* BÜTÜN PROQRAMI KİLİDƏ SALAN KOMPONENT */}
        <AppLock>
          
          {/* Vebsayt üçün Navbar (Mobildə gizlədilir ki, proqram kimi görünsün) */}
          <div className="hidden md:block">
            <Navbar />
          </div>
          
          {/* Mobildə alt menyu məzmunun üstünü örtməsin deyə pb-20 əlavə edildi */}
          <main className="flex-grow pb-20 md:pb-0">
            {children}
          </main>

          {/* Vebsayt üçün Footer (Mobildə gizlədilir) */}
          <div className="hidden md:block">
            <Footer />
          </div>

          {/* Canlı Redaktə (Live Edit) Paneli */}
          <Suspense fallback={null}>
            <FloatingEditor />
          </Suspense>
          
          {/* 2. YENİ ALT MENYU ƏLAVƏ EDİLDİ (Yalnız telefonda görünür) */}
          <BottomNav />

        </AppLock>
        
      </body>
    </html>
  );
}