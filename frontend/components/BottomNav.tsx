"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function BottomNav() {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* ƏLAVƏ MENYU (Aşağıdan çıxan pəncərə) */}
      {showMenu && (
        <div className="fixed inset-0 z-40 flex items-end md:hidden">
          {/* Qaranlıq arxa plan */}
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setShowMenu(false)}></div>
          
          {/* Menyuların olduğu qutu */}
          <div className="relative w-full bg-white rounded-t-3xl p-5 pb-24 shadow-2xl animate-in slide-in-from-bottom-8 duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <h3 className="text-base font-bold text-slate-800 mb-5 ml-1">Daha çox kəşf et</h3>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Şagirdlər */}
              <Link href="/students" onClick={() => setShowMenu(false)} className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-2xl active:bg-blue-100 transition">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
                <span className="text-[11px] font-bold text-blue-900">Şagirdlər</span>
              </Link>
              
              {/* Rəylər */}
              <Link href="/feedback" onClick={() => setShowMenu(false)} className="flex flex-col items-center gap-2 p-4 bg-amber-50 rounded-2xl active:bg-amber-100 transition">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <span className="text-[11px] font-bold text-amber-900">Rəylər</span>
              </Link>
              
              {/* Haqqımızda */}
              <Link href="/about" onClick={() => setShowMenu(false)} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl active:bg-slate-100 transition">
                <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-[11px] font-bold text-slate-900">Haqqımızda</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SABİT ALT MENYU */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50 md:hidden">
        <div className="flex justify-around items-center h-16 px-1">
          
          {/* 1. Ana Səhifə */}
          <Link href="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/') ? 'text-blue-600' : 'text-slate-400 active:text-slate-600'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span className="text-[10px] font-bold">Əsas</span>
          </Link>

          {/* 2. Xəritə */}
          <Link href="/map" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/map') ? 'text-blue-600' : 'text-slate-400 active:text-slate-600'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            <span className="text-[10px] font-bold">Xəritə</span>
          </Link>

          {/* 3. Müəllimlər */}
          <Link href="/teachers" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/teachers') ? 'text-blue-600' : 'text-slate-400 active:text-slate-600'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            <span className="text-[10px] font-bold">Müəllimlər</span>
          </Link>

          {/* 4. Profil */}
          <Link href="/profile" className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive('/profile') ? 'text-blue-600' : 'text-slate-400 active:text-slate-600'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span className="text-[10px] font-bold">Hesabım</span>
          </Link>

          {/* 5. Daha Çox (Menyu) */}
          <button onClick={() => setShowMenu(!showMenu)} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${showMenu ? 'text-blue-600' : 'text-slate-400 active:text-slate-600'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            <span className="text-[10px] font-bold">Daha çox</span>
          </button>

        </div>
      </nav>
    </>
  );
}