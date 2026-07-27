import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 🌟 HERO SECTİON (Qarşılama Ekranı) */}
      <div className="relative bg-white overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-16 px-4 sm:px-6 lg:px-8">
            <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                
                <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-bold tracking-wider mb-4 border border-blue-100">
                  🚀 AZƏRBAYCANIN YENİ TƏHSİL PLATFORMASI
                </span>
                
                <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Gələcəyinizi</span>{' '}
                  <span className="block text-blue-600 xl:inline">Peşəkarlarla</span> qur
                </h1>
                
                <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-relaxed">
                  İstər imtahanlara hazırlaşın, istərsə də yeni bir dil öyrənin. Sizin üçün ən uyğun, təcrübəli və büdcənizə xitab edən müəllimi <b>Hazırlıqlar</b> platformasında asanlıqla tapın.
                </p>
                
                <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                  <Link href="/teachers" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all md:py-4 md:text-lg md:px-10">
                    Müəllimləri Gör
                  </Link>
                  <Link href="/map" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-slate-200 text-base font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all md:py-4 md:text-lg md:px-10 gap-2">
                    🗺️ Xəritədə Axtar
                  </Link>
                </div>

              </div>
            </main>
          </div>
        </div>
        
        {/* Sağ tərəfdəki Gözəl Şəkil */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full rounded-l-3xl shadow-2xl"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
            alt="Tələbələr və Müəllim"
          />
        </div>
      </div>

      {/* 🌟 NİYƏ BİZ? (Haqqımızda Qısa) */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-bold tracking-wide uppercase">Üstünlüklərimiz</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Niyə bizi seçməlisiniz?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
              Təhsil almaq heç vaxt bu qədər rahat və güvənli olmamışdı. Biz sizin üçün hər detalı düşündük.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              {/* Kart 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">
                  📍
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Dəqiq Xəritə Sistemi</h3>
                <p className="text-slate-500 leading-relaxed">
                  Müəllimlərin tam dəqiq ünvanlarını Google Peyk xəritəsi üzərindən görərək, sizə ən yaxın olanı anında tapın. Yol və vaxt itkisinə son!
                </p>
              </div>

              {/* Kart 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">
                  👨‍🏫
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Təsdiqlənmiş Müəllimlər</h3>
                <p className="text-slate-500 leading-relaxed">
                  Platformadakı hər bir müəllim qeydiyyatdan keçərək öz profilini tam təsdiqləyir. Təcrübə, fənn və qiymətlər tam şəffafdır.
                </p>
              </div>

              {/* Kart 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">
                  🔒
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Güvənli və Etibarlı</h3>
                <p className="text-slate-500 leading-relaxed">
                  Məlumatlarınız tam təhlükəsizliklə qorunur. Platformamız vasitəsilə təhsildə saxtakarlığın qarşısını alırıq.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 🌟 AŞAĞI ÇAĞIRIŞ BÖLMƏSİ */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Daha nə gözləyirsiniz?</span>
            <span className="block text-blue-200">Elə indi təhsilinizə başlayın.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-4">
            <Link href="/register" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-blue-600 bg-white hover:bg-blue-50 transition shadow-lg">
              İndi Qeydiyyatdan Keç
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}