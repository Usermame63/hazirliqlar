import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* TƏTBİQ BAŞLIĞI (APP HEADER) */}
      <header className="bg-white px-5 pt-12 pb-5 rounded-b-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Xoş gəldiniz</p>
            <h1 className="text-2xl font-bold text-slate-900">Hazırlıqlar</h1>
          </div>
          {/* Profil / Qeydiyyat ikonu */}
          <Link href="/register" className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 active:bg-blue-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </Link>
        </div>

        {/* AXTARIŞ ÇUBUĞU */}
        <div className="flex items-center bg-slate-100 rounded-2xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input 
            type="text" 
            placeholder="Kimi və ya nəyi axtarırsınız?" 
            className="bg-transparent w-full ml-3 outline-none text-slate-700 text-base placeholder-slate-400" 
          />
        </div>
      </header>

      <main className="px-5 pt-6 space-y-8">
        
        {/* ƏSAS HƏRƏKƏT DÜYMƏLƏRİ */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/teachers" className="bg-blue-600 text-white p-4 rounded-2xl shadow-sm active:scale-95 transition-transform flex flex-col justify-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <h3 className="font-bold text-sm">Müəllimləri Gör</h3>
            <p className="text-blue-100 text-xs mt-1">Siyahıdan seç</p>
          </Link>
          
          <Link href="/map" className="bg-white border border-slate-200 text-slate-800 p-4 rounded-2xl shadow-sm active:scale-95 transition-transform flex flex-col justify-center">
            <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            </div>
            <h3 className="font-bold text-sm">Xəritədə Axtar</h3>
            <p className="text-slate-500 text-xs mt-1">Yaxınlığında tap</p>
          </Link>
        </div>

        {/* ÜSTÜNLÜKLƏR / KATEQORİYALAR */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">Niyə Hazırlıqlar?</h2>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Dəqiq Xəritə Sistemi</h3>
                <p className="text-xs text-slate-500 mt-1">Sizə ən yaxın olanı anında tapın.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Təsdiqlənmiş Müəllimlər</h3>
                <p className="text-xs text-slate-500 mt-1">Hər bir profil xüsusi yoxlanılır.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Güvənli və Etibarlı</h3>
                <p className="text-xs text-slate-500 mt-1">Məlumatlarınız tam qorunur.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AŞAĞI ÇAĞIRIŞ BÖLMƏSİ (Banner) */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          <h2 className="text-lg font-bold mb-2">Gələcəyinizi Peşəkarlarla Qur</h2>
          <p className="text-sm text-slate-400 mb-5 leading-relaxed">
            İstər imtahanlara hazırlaşın, istərsə də yeni bir dil öyrənin.
          </p>
          <Link href="/register" className="block w-full bg-blue-600 text-center py-3 rounded-xl font-bold text-sm active:bg-blue-700 transition-colors">
            İndi Qeydiyyatdan Keç
          </Link>
        </div>

      </main>
    </div>
  );
}