"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SecurityPage() {
  const router = useRouter();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setSaveStatus("Yeni şifrə ən az 6 simvol olmalıdır.");
      return;
    }
    // Burada backend-ə axios ilə post sorğusu gedəcək
    setSaveStatus("Gözləyin...");
    setTimeout(() => {
      setSaveStatus("Şifrə uğurla yeniləndi! ✅");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* ÜST BAŞLIQ */}
      <header className="bg-white px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full active:scale-95 transition-transform text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">Təhlükəsizlik</h1>
        <div className="w-10"></div>
      </header>

      <main className="px-5 pt-6 max-w-lg mx-auto space-y-6">
        
        {/* Məlumat Kartı */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl flex items-start gap-4">
          <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Hesabınız Qorunur</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">Şifrənizi kimsə ilə paylaşmayın. Daha güclü qorunma üçün vaxtaşırı şifrənizi yeniləyin.</p>
          </div>
        </div>

        {/* Şifrə Dəyişmə Forması */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-3">Şifrəni Yenilə</h3>
          <form onSubmit={handleUpdatePassword} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            
            {saveStatus && (
              <div className={`p-3 rounded-xl text-xs font-bold text-center border ${saveStatus.includes('✅') ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                {saveStatus}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Hazırkı Şifrə</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Yeni Şifrə</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
            </div>

            <button type="submit" className="w-full mt-2 bg-slate-900 text-white font-bold py-3 rounded-xl active:bg-slate-700 transition-colors text-sm shadow-md shadow-slate-900/20">
              Şifrəni Dəyiş
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}