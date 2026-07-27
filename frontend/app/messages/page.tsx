"use client";

import Link from "next/link";

export default function Messages() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10 text-center animate-in zoom-in-95 duration-500">
        
        {/* Animasiyalı İkon */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-50"></div>
          <div className="relative w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-md mx-auto">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12 3 7.582 7.03 4 12 4s9 3.582 9 8z"></path>
            </svg>
          </div>
        </div>
        
        {/* Mətnlər */}
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Canlı Chat Sistemi</h1>
        <h2 className="text-xl font-bold text-blue-600 mb-5">Tezliklə Sizinlə! 🚀</h2>
        
        <p className="text-slate-500 mb-8 leading-relaxed font-medium">
          Müəllimlər və şagirdlər arasında birbaşa əlaqə yaratmaq üçün nəzərdə tutulmuş "Real-time Chat" funksiyası üzərində son tamamlama işləri gedir. Çox yaxında istifadənizə veriləcək.
        </p>
        
        {/* Geri Düyməsi */}
        <Link href="/" className="inline-block w-full bg-slate-900 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-slate-800 transition shadow-lg">
          Ana Səhifəyə Qayıt
        </Link>
        
      </div>
    </div>
  );
}