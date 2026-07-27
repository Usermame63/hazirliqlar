import Link from "next/link";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Bölməsi */}
      <div className="bg-slate-900 py-20 px-4 relative overflow-hidden">
        {/* Dekorativ arxa plan xətləri */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon fill="currentColor" className="text-slate-800" points="0,100 100,0 100,100" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold tracking-wider mb-6 border border-blue-500/30">
            🛡️ GÜVƏNLİ PLATFORMA
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Təhlükəsizlik və <span className="text-blue-500">Qaydalar</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Sizin məlumatlarınızın təhlükəsizliyi və platformamızda sağlam təhsil mühitinin qorunması bizim ən ali məqsədimizdir. Şərtlərimizlə tanış olun.
          </p>
        </div>
      </div>

      {/* Əsas Məzmun */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        
        {/* 1. Məlumatların Qorunması */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Şəxsi Məlumatların Qorunması</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Şifrələmə (End-to-End Encryption)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Platformamıza daxil etdiyiniz bütün şifrələr qabaqcıl <strong className="text-slate-800">Bcrypt</strong> texnologiyası ilə geri qaytarılmaz şəkildə hash-lənir. Şifrələrinizi biz belə görə bilmərik. Əlaqə məlumatlarınız isə bazamızda yüksək səviyyəli təhlükəsizlik protokolları ilə mühafizə olunur.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Üçüncü Tərəflərlə Paylaşım Yoxdur
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Sizin e-poçt ünvanınız, telefon nömrəniz və ya məkan məlumatlarınız heç bir halda reklam şirkətlərinə və ya üçüncü tərəflərə satıla, ötürülə bilməz. Məlumatlar yalnız platforma daxilindəki əlaqə üçün istifadə edilir.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Platforma Qaydaları */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Ümumi Qaydalarımız</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <ul className="divide-y divide-slate-100">
              <li className="p-6 md:p-8 flex gap-4 hover:bg-slate-50 transition-colors">
                <div className="text-blue-500 font-bold mt-1">1.</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Saxta Profillərə Qadağa</h4>
                  <p className="text-slate-600 text-sm md:text-base">Müəllimlər və şagirdlər özləri haqqında tam doğru məlumat verməlidirlər. Başqasının adından istifadə etmək, saxta şəkillər yükləmək hesabın dərhal və birdəfəlik silinməsi ilə nəticələnəcək.</p>
                </div>
              </li>
              <li className="p-6 md:p-8 flex gap-4 hover:bg-slate-50 transition-colors">
                <div className="text-blue-500 font-bold mt-1">2.</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Qarşılıqlı Hörmət</h4>
                  <p className="text-slate-600 text-sm md:text-base">Mesajlaşma sistemində təhqir, senzuradan kənar sözlər, ayrı-seçkilik yaradan ifadələr işlətmək qəti qadağandır. Platforma yalnız təhsil məqsədləri üçündür.</p>
                </div>
              </li>
              <li className="p-6 md:p-8 flex gap-4 hover:bg-slate-50 transition-colors">
                <div className="text-blue-500 font-bold mt-1">3.</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Şəffaf Qiymətləndirmə</h4>
                  <p className="text-slate-600 text-sm md:text-base">Müəllimlərin profilində qeyd etdiyi aylıq ödənişlər real olmalıdır. Şagirdləri cəlb etmək üçün saxta aşağı qiymət yazıb, sonradan fərqli qiymət tələb etmək qayda pozuntusudur.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Tövsiyələr */}
        <div className="bg-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 text-blue-200/50">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold text-blue-900 mb-6">Təhlükəsizliyiniz üçün tövsiyələr</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-3 items-start">
                <div className="mt-1 bg-white p-1 rounded-full text-blue-600 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p className="text-blue-900/80 text-sm">İlk dərsi və ya görüşü həmişə ictimai yerlərdə və ya onlayn olaraq keçirin.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="mt-1 bg-white p-1 rounded-full text-blue-600 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p className="text-blue-900/80 text-sm">Ödənişləri qabaqcadan tam şəkildə tanımadığınız şəxslərə göndərməyin.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="mt-1 bg-white p-1 rounded-full text-blue-600 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p className="text-blue-900/80 text-sm">Şübhəli hərəkət və ya mesaj gördükdə profilin yuxarısındakı "Şikayət et" düyməsindən istifadə edin.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="mt-1 bg-white p-1 rounded-full text-blue-600 shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p className="text-blue-900/80 text-sm">Bütün ünsiyyəti bizim platformanın təhlükəsiz Mesajlaşma bölməsində aparmağa çalışın.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Probleminiz var? */}
        <div className="mt-16 text-center border-t border-slate-200 pt-12">
          <p className="text-slate-600 mb-4 font-medium">Hər hansı təhlükəsizlik problemi ilə qarşılaşmısınız?</p>
          <Link href="/about" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition shadow-md gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Dərhal Bizimlə Əlaqə Saxlayın
          </Link>
        </div>

      </div>
    </div>
  );
}