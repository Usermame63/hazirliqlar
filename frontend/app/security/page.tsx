import Link from "next/link";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      
      {/* TƏTBİQ BAŞLIĞI */}
      <header className="bg-white px-5 pt-12 pb-5 rounded-b-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative z-10">
        <h1 className="text-xl font-bold text-slate-900">Təhlükəsizlik</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Qaydalar və Məxfilik</p>
      </header>

      <main className="px-4 pt-6 space-y-6 max-w-2xl mx-auto">
        
        {/* HERO (Mobil Kart Formatı) */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-slate-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-overlay filter blur-2xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>

          <h2 className="text-xl font-extrabold mb-2 leading-tight">
            Güvənli Platforma
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Sizin məlumatlarınızın təhlükəsizliyi və platformamızda sağlam təhsil mühitinin qorunması bizim ən ali məqsədimizdir.
          </p>
        </div>

        {/* 1. MƏLUMATLARIN QORUNMASI */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 ml-1">Məlumatların Qorunması</h3>
          <div className="space-y-3">
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-3">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Şifrələmə (End-to-End)</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Platformamıza daxil etdiyiniz bütün şifrələr qabaqcıl Bcrypt texnologiyası ilə geri qaytarılmaz şəkildə hash-lənir. Əlaqə məlumatlarınız isə yüksək səviyyəli protokollarla qorunur.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Məxfilik Qorunur</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Sizin e-poçt ünvanınız və ya telefon nömrəniz heç bir halda reklam şirkətlərinə satıla, üçüncü tərəflərə ötürülə bilməz. Yalnız platforma daxili istifadə üçündür.</p>
              </div>
            </div>

          </div>
        </div>

        {/* 2. QAYDALAR */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 ml-1">Ümumi Qaydalarımız</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
            
            <div className="p-4 flex gap-3">
              <span className="text-blue-500 font-black text-sm pt-0.5">1.</span>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Saxta Profillərə Qadağa</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Müəllimlər və şagirdlər özləri haqqında tam doğru məlumat verməlidirlər. Başqasının adından istifadə etmək və ya saxta şəkillər yükləmək hesabın dərhal silinməsi ilə nəticələnəcək.</p>
              </div>
            </div>

            <div className="p-4 flex gap-3">
              <span className="text-blue-500 font-black text-sm pt-0.5">2.</span>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Qarşılıqlı Hörmət</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Mesajlaşma sistemində təhqir, senzuradan kənar sözlər, ayrı-seçkilik yaradan ifadələr işlətmək qəti qadağandır. Platforma yalnız təhsil məqsədləri üçündür.</p>
              </div>
            </div>

            <div className="p-4 flex gap-3">
              <span className="text-blue-500 font-black text-sm pt-0.5">3.</span>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Şəffaf Qiymətləndirmə</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Müəllimlərin qeyd etdiyi aylıq ödənişlər real olmalıdır. Şagirdləri cəlb etmək üçün saxta aşağı qiymət yazıb, sonradan fərqli qiymət tələb etmək qayda pozuntusudur.</p>
              </div>
            </div>

          </div>
        </div>

        {/* 3. TÖVSİYƏLƏR */}
        <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
          <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Təhlükəsizliyiniz üçün
          </h3>
          <ul className="space-y-3">
            <li className="flex gap-2.5 items-start">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span className="text-xs text-blue-900/80 leading-relaxed">İlk dərsi və ya görüşü həmişə ictimai yerlərdə və ya onlayn olaraq keçirin.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span className="text-xs text-blue-900/80 leading-relaxed">Ödənişləri qabaqcadan tam şəkildə tanımadığınız şəxslərə göndərməyin.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span className="text-xs text-blue-900/80 leading-relaxed">Şübhəli hərəkət gördükdə profilin yuxarısındakı "Şikayət et" funksiyasından istifadə edin.</span>
            </li>
            <li className="flex gap-2.5 items-start">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              <span className="text-xs text-blue-900/80 leading-relaxed">Bütün ünsiyyəti bizim platformanın təhlükəsiz Mesajlaşma bölməsində aparmağa çalışın.</span>
            </li>
          </ul>
        </div>

        {/* Əlaqə (CTA) */}
        <Link href="/about" className="mt-2 flex items-center justify-center gap-2 w-full bg-white border border-slate-200 text-slate-800 font-bold py-3.5 rounded-xl active:bg-slate-50 transition text-sm shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          Bizimlə Əlaqə Saxlayın
        </Link>

      </main>
    </div>
  );
}