import Link from "next/link";

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Şagirdlər - Başlıq */}
      <div className="bg-blue-600 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500 text-white text-sm font-bold tracking-wider mb-4 border border-blue-400">
            🎓 ŞAGİRDLƏR ÜÇÜN
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Öz potensialını kəşf et, ən yaxşılardan öyrən.
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Məktəb dərsləri, abituriyent hazırlığı və ya yeni dil öyrənmək... Sənin hədəfinə uyğun müəllim artıq bu platformadadır.
          </p>
          <Link href="/register" className="inline-block bg-white text-blue-600 font-bold py-3.5 px-8 rounded-xl hover:bg-slate-50 transition shadow-lg">
            İndi Qeydiyyatdan Keç
          </Link>
        </div>
      </div>

      {/* Necə İşləyir - Addımlar */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Platforma necə işləyir?</h2>
            <p className="text-slate-500 mt-2">Cəmi 3 sadə addımla təhsilinə başla.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Addım 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center relative z-10 hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-inner">1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Xəritədə Axtar</h3>
              <p className="text-slate-500">Özünə ən yaxın, gediş-gəlişi rahat olan müəllimləri bizim peyk xəritəmizdə asanlıqla tap.</p>
            </div>
            
            {/* Addım 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center relative z-10 hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-inner">2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Müqayisə Et</h3>
              <p className="text-slate-500">Müəllimlərin təcrübəsini, qiymətlərini və tədris formatını detallı şəkildə araşdırıb qərar ver.</p>
            </div>

            {/* Addım 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center relative z-10 hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 shadow-inner">3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Əlaqə Saxla</h3>
              <p className="text-slate-500">Sənə ən uyğun gələn müəllimin profilinə daxil ol və birbaşa dərslərə başlamaq üçün müraciət et.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/map" className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition shadow-lg">
              🗺️ Xəritəni İndi Aç
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}