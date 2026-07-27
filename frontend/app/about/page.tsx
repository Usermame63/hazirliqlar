import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Haqqımızda - Hero */}
      <div className="bg-slate-50 border-b border-slate-200 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Təhsili hər kəs üçün <span className="text-blue-600">əlçatan, şəffaf və güvənli</span> edirik.
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            "Hazırlıqlar" platforması olaraq məqsədimiz öyrənmək istəyənlərlə öyrətməyi sevənləri ən rahat və müasir yolla bir araya gətirməkdir. Düzgün müəllim seçimi uğurun ən böyük açarıdır.
          </p>
        </div>
      </div>

      {/* Dəyərlərimiz (Smayliklər Peşəkar İkonlarla Əvəzləndi) */}
      <div className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          {/* Kart 1 */}
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Təhlükəsizlik və Məxfilik</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              İstifadəçi məlumatları ən müasir şifrələmə standartları ilə qorunur. Həm müəllimlər, həm də şagirdlər üçün rəqəmsal təhlükəsizlik bizim bir nömrəli prioritetimizdir. Heç bir məlumat üçüncü tərəflərə ötürülmür.
            </p>
          </div>

          {/* Kart 2 */}
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Yüksək Keyfiyyət</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Platformadakı müəllimlər və onların təqdim etdiyi məlumatlar tam şəffaflıqla göstərilir. Saxta hesablara və qeyri-real qiymətlərə yer yoxdur. Siz yalnız ən yaxşı və təsdiqlənmiş namizədlərlə yola davam edirsiniz.
            </p>
          </div>

          {/* Kart 3 */}
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Vaxta Qənaət</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              İnnovativ xəritə sistemimizlə sizə ən yaxın müəllimi anında taparaq yollarda itirilən dəyərli vaxtın qarşısını alırsınız. Axtarışdan tutmuş əlaqəyə qədər bütün proseslər avtomatlaşdırılıb.
            </p>
          </div>

        </div>
      </div>

      {/* Ətraflı Məlumat və Missiya */}
      <div className="py-20 px-4 max-w-7xl mx-auto border-b border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Biz Kimik və Nə Üçün Yaratdıq?</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg font-medium">
              <p>
                Platformamız yaranmadan əvvəl müəllim tapmaq ancaq tanışlıq, qeyri-dəqiq məlumatlar və ya uzun, yorucu axtarışlar bahasına başa gəlirdi. Çox vaxt şagirdlər onlara uzaq olan, hər gün yollarda saatlarla vaxt itirdikləri məkanlara getmək məcburiyyətində qalırdılar. Biz bu problemi kökündən həll etmək qərarına gəldik.
              </p>
              <p>
                İndi isə inqilabi <strong className="text-blue-600">Peyk Xəritəsi və GPS</strong> texnologiyamız sayəsində, istifadəçilər qapılarının ağzından tutmuş istədikləri şəhərə qədər ən uyğun müəllimləri canlı xəritədə görə bilir, onların təcrübələrini, büdcələrini və tədris növlərini tək toxunuşla müqayisə edə bilirlər.
              </p>
              <p className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-6 text-sm">
                <strong className="text-slate-900 block mb-2 text-base">🔒 Təhlükəsizlik və Nəzarət</strong>
                Biz rəqəmsal mühitdə hər kəsin özünü güvəndə hiss etməsi üçün çalışırıq. Müəllimlərin profil məlumatları, ünvan dəqiqliyi və qiymət siyasəti açıq-aydındır. Heç bir gizli xərc və ya yalançı profilə yer yoxdur. Saytımızın alt quruluşu ən son texnologiyalarla yığılıb ki, şəxsi məlumatlarınız daim təhlükəsizlikdə olsun.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img className="rounded-3xl shadow-lg w-full h-56 object-cover hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Təhsil" />
              <img className="rounded-3xl shadow-lg w-full h-72 object-cover hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Komanda" />
            </div>
            <div className="space-y-4 pt-12">
              <img className="rounded-3xl shadow-lg w-full h-72 object-cover hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Şagirdlər" />
              <img className="rounded-3xl shadow-lg w-full h-56 object-cover hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Məktəb" />
            </div>
          </div>
        </div>
      </div>

      {/* Bizimlə Əlaqə Bölməsi */}
      <div className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Bizimlə Əlaqə</h2>
          <p className="text-slate-500 text-lg mb-12 max-w-2xl mx-auto font-medium">
            Sualınız var? Təklif və ya şikayətləriniz üçün hər zaman xidmətinizdəyik. Texniki dəstək və digər məsələlər üçün bizə yaza və ya zəng edə bilərsiniz.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            
            {/* E-poçt Kartı */}
            <a href="mailto:zelgun730@gmail.com" className="group flex items-center gap-5 bg-white px-8 py-6 rounded-3xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 w-full md:w-auto">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">E-Poçt Ünvanımız</div>
                <div className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">zelgun730@gmail.com</div>
              </div>
            </a>

            {/* Telefon Kartı */}
            <a href="tel:0559126138" className="group flex items-center gap-5 bg-white px-8 py-6 rounded-3xl shadow-sm border border-slate-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 w-full md:w-auto">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Telefon Nömrəmiz</div>
                <div className="text-xl font-black text-slate-800 group-hover:text-green-600 transition-colors">055 912 61 38</div>
              </div>
            </a>

          </div>
        </div>
      </div>

    </div>
  );
}