"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotificationsPage() {
  const router = useRouter();
  
  // Gələcək üçün nəzərdə tutulmuş bildiriş ayarları (Toggles)
  const [teacherNotif, setTeacherNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [reminderNotif, setReminderNotif] = useState(true);
  const [securityNotif, setSecurityNotif] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* ÜST BAŞLIQ */}
      <header className="bg-white px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full active:scale-95 transition-transform text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">Bildirişlər</h1>
        <div className="w-10"></div>
      </header>

      <main className="px-5 pt-6 max-w-lg mx-auto space-y-6">
        
        {/* Nümunə Bildiriş Mesajları */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-3">Son Bildirişlər</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-4 items-start relative">
              <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Platformaya Xoş Gəldiniz!</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Bildiriş tənzimləmələrini aşağıdan idarə edə bilərsiniz.</p>
                <span className="text-[10px] text-slate-400 font-medium mt-2 block">2 saat əvvəl</span>
              </div>
            </div>
          </div>
        </div>

        {/* Yeni Tənzimləmələr (Toggles) */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-3">Bildiriş Kanalları</h3>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
            
            {/* Müəllim bildirişi */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Müəllim Bildirişləri</h4>
                <p className="text-[11px] text-slate-500">Müəllimlərdən gələn mesajlar və rəylər.</p>
              </div>
              <button onClick={() => setTeacherNotif(!teacherNotif)} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${teacherNotif ? 'bg-green-500' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute transition-transform ${teacherNotif ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>

            {/* SMS bildirişi */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">SMS Bildirişləri</h4>
                <p className="text-[11px] text-slate-500">Vacib məlumatları nömrənizə göndərək.</p>
              </div>
              <button onClick={() => setSmsNotif(!smsNotif)} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${smsNotif ? 'bg-green-500' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute transition-transform ${smsNotif ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>

            {/* Xatırlatma bildirişi */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Xatırlatmalar</h4>
                <p className="text-[11px] text-slate-500">Dərs vaxtları və vacib görüşlər barədə.</p>
              </div>
              <button onClick={() => setReminderNotif(!reminderNotif)} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${reminderNotif ? 'bg-green-500' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute transition-transform ${reminderNotif ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>

            {/* Təhlükəsizlik bildirişi */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Təhlükəsizlik Bildirişləri</h4>
                <p className="text-[11px] text-slate-500">Yeni hesab girişləri və şifrə dəyişikliyi.</p>
              </div>
              <button onClick={() => setSecurityNotif(!securityNotif)} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${securityNotif ? 'bg-green-500' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute transition-transform ${securityNotif ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}