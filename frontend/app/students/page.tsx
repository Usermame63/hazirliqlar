import Link from "next/link";

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      
      {/* TƏTBİQ BAŞLIĞI */}
      <header className="bg-white px-5 pt-12 pb-5 rounded-b-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative z-10">
        <h1 className="text-xl font-bold text-slate-900">Şagirdlər üçün</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Ən yaxşılardan öyrənin</p>
      </header>

      <main className="px-4 pt-6 space-y-6 max-w-2xl mx-auto">
        
        {/* HERO (Mobil Kart Formatı) */}
        <div className="bg-blue-600 text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-blue-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
          </div>

          <h2 className="text-xl font-extrabold mb-2 leading-tight">
            Öz potensialını kəşf et, ən yaxşılardan öyrən.
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed mb-6">
            Məktəb dərsləri, abituriyent hazırlığı və ya yeni dil öyrənmək... Sənin hədəfinə uyğun müəllim artıq bu platformadadır.
          </p>
          
          <Link href="/register" className="block w-full bg-white text-blue-600 text-center font-bold py-3.5 rounded-xl active:bg-slate-50 transition text-sm shadow-sm">
            İndi Qeydiyyatdan Keç
          </Link>
        </div>

        {/* NECƏ İŞLƏYİR (Mobil Addımlar - Timeline) */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-base font-bold text-slate-900 mb-5">Platforma necə işləyir?</h3>
          
          {/* Sol tərəfdəki şaquli xətt */}
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:to-slate-100">
            
            {/* Addım 1 */}
            <div className="relative flex items-start gap-4">
              <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 z-10 border-4 border-white shadow-sm">1</div>
              <div className="pt-1.5">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Xəritədə Axtar</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Özünə ən yaxın, gediş-gəlişi rahat olan müəllimləri bizim peyk xəritəmizdə asanlıqla tap.</p>
              </div>
            </div>

            {/* Addım 2 */}
            <div className="relative flex items-start gap-4">
              <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 z-10 border-4 border-white shadow-sm">2</div>
              <div className="pt-1.5">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Müqayisə Et</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Müəllimlərin təcrübəsini, qiymətlərini və tədris formatını detallı şəkildə araşdırıb qərar ver.</p>
              </div>
            </div>

            {/* Addım 3 */}
            <div className="relative flex items-start gap-4">
              <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 z-10 border-4 border-white shadow-sm">3</div>
              <div className="pt-1.5">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Əlaqə Saxla</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Sənə ən uyğun gələn müəllimin profilinə daxil ol və birbaşa dərslərə başlamaq üçün müraciət et.</p>
              </div>
            </div>

          </div>

          <Link href="/map" className="mt-6 flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl active:bg-slate-800 transition text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
            Xəritəni İndi Aç
          </Link>
        </div>

      </main>
    </div>
  );
}