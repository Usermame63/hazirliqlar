"use client";

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes'; // YENİ ƏLAVƏ

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme(); // Qaranlıq/işıq rejimi üçün
  
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 dark:bg-slate-900/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link href="/" className="text-2xl font-extrabold text-blue-600 tracking-tight flex-shrink-0 dark:text-blue-500">
            Hazırlıqlar<span className="text-slate-800 dark:text-slate-200">.</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {/* Menyu linkləri */}
            <Link href="/map" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l6-3 5.447 2.724A1 1 0 0121 7.618v10.764a1 1 0 01-1.447.894L15 17l-6 3z"></path></svg>
              Xəritə
            </Link>
            <Link href="/teachers" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Müəllimlər
            </Link>
            <Link href="/students" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
              Şagirdlər
            </Link>
            <Link href="/about" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Haqqımızda
            </Link>
            <Link href="/feedback" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors dark:text-slate-400 dark:hover:text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
              Rəylər
            </Link>
          </div>

          {/* Sağ tərəf */}
          <div className="flex items-center gap-3 flex-shrink-0">
            
            {/* YENİ: QARANLIQ REJİM DÜYMƏSİ */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            </button>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 bg-slate-100 text-slate-800 px-5 py-2.5 rounded-full font-bold hover:bg-slate-200 transition-all dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                  <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  <span>Hesabım</span>
                  <svg className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-200 dark:bg-slate-800 dark:border-slate-700">
                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 border-b border-slate-100 transition flex items-center gap-3 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400 dark:border-slate-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      Şəxsi Profil
                    </Link>
                    <Link href="/messages" onClick={() => setIsDropdownOpen(false)} className="px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 border-b border-slate-100 transition flex items-center gap-3 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400 dark:border-slate-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12 3 7.582 7.03 4 12 4s9 3.582 9 8z"></path></svg>
                      Mesajlarım
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-5 py-3.5 text-sm font-bold text-red-600 hover:bg-red-50 transition flex items-center gap-3 dark:text-red-400 dark:hover:bg-red-900/30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                      Çıxış et
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-slate-600 hover:text-blue-600 font-semibold px-4 py-2 transition-colors dark:text-slate-400 dark:hover:text-blue-500">Daxil ol</Link>
                <Link href="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600">Qeydiyyat</Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}