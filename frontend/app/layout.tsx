import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes"; 
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingEditor from "../components/FloatingEditor";
import BottomNav from "../components/BottomNav";
import AppLock from "../components/AppLock";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hazırlıqlar - Müəllim Tap",
  description: "Özünüzə ən yaxın və ən uyğun hazırlıq müəllimini xəritədə tapın.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="az" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col dark:bg-slate-950 dark:text-slate-200 transition-colors duration-300`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AppLock>
              <div className="hidden md:block">
                <Navbar />
              </div>
              <main className="flex-grow pb-20 md:pb-0">
                {children}
              </main>
              <div className="hidden md:block">
                <Footer />
              </div>
              <Suspense fallback={null}>
                <FloatingEditor />
              </Suspense>
              <BottomNav />
            </AppLock>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}