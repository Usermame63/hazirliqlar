import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      
      {/* TƏTBİQ BAŞLIĞI */}
      <header className="bg-white px-5 pt-12 pb-5 rounded-b-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative z-10">
        <h1 className="text-xl font-bold text-slate-900">Haqqımızda</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Platforma və missiyamız</p>
      </header>

      <main className="px-4 pt-6 space-y-6 max-w-2xl mx-auto">
        
        {/* Qısa Məlumat (Hero Mobil) */}
        <div className="bg-blue-600 text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-blue-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          <h2 className="text-xl font-extrabold mb-3 leading-tight">
            Təhsili əlçatan, şəffaf və güvənli edirik.
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Məqsədimiz öyrənmək istəyənlərlə öyrətməyi sevənləri ən rahat və müasir yolla bir araya gətirməkdir. Düzgün müəllim seçimi uğurun açarıdır.
          </p>
        </div>

        {/* Dəyərlərimiz (Kompakt Siyahı) */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 ml-1">Dəyərlərimiz</h3>
          <div className="space-y-3">
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Təhlükəsizlik və Məxfilik</h4>
                <p className="text-xs text-slate-500 leading-relaxed">İstifadəçi məlumatları ən müasir şifrələmə standartları ilə qorunur. Məlumatlarınız üçüncü tərəflərə ötürülmür.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Yüksək Keyfiyyət</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Profil məlumatları tam şəffaflıqla göstərilir. Saxta hesablara və qeyri-real qiymətlərə yer yoxdur.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Vaxta Qənaət</h4>
                <p className="text-xs text-slate-500 leading-relaxed">İnnovativ xəritə sistemimizlə sizə ən yaxın müəllimi taparaq yollarda itirilən vaxtın qarşısını alırsınız.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Missiya və Detallar */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Biz Kimik və Nə Üçün Yaratdıq?</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Platformamız yaranmadan əvvəl müəllim tapmaq ancaq tanışlıq, qeyri-dəqiq məlumatlar və ya uzun axtarışlar bahasına başa gəlirdi. Biz bu problemi həll etmək qərarına gəldik.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            İndi <strong className="text-blue-600">Peyk Xəritəsi və GPS</strong> texnologiyamız sayəsində, istifadəçilər özlərinə ən uyğun müəllimləri canlı xəritədə görə bilir, məlumatları asanlıqla müqayisə edə bilirlər.
          </p>
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <strong className="text-slate-800 text-sm">Təhlükəsizlik Nəzarəti</strong>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Müəllimlərin profil məlumatları, ünvan dəqiqliyi və qiymət siyasəti açıq-aydındır. Gizli xərc və ya yalançı profilə yer yoxdur.
            </p>
          </div>
        </div>

        {/* Mobil Üçün Şəkil Qalereyası */}
        <div className="grid grid-cols-2 gap-3">
          <img className="rounded-2xl w-full h-32 object-cover border border-slate-100" src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Təhsil" />
          <img className="rounded-2xl w-full h-32 object-cover border border-slate-100" src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Şagirdlər" />
        </div>

        {/* Əlaqə Məlumatları (Mobil Düymələr) */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 ml-1">Bizimlə Əlaqə</h3>
          <p className="text-xs text-slate-500 mb-4 ml-1">Sual, təklif və şikayətləriniz üçün hər zaman xidmətinizdəyik.</p>
          
          <div className="space-y-3">
            <a href="mailto:zelgun730@gmail.com" className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 active:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">E-Poçt Ünvanı</div>
                  <div className="text-sm font-bold text-slate-800">zelgun730@gmail.com</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </a>

            <a href="tel:0559126138" className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 active:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Telefon Nömrəsi</div>
                  <div className="text-sm font-bold text-slate-800">055 912 61 38</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}