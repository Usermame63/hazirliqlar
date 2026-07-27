import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Sol tərəf */}
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-3">
              Hazırlıqlar<span className="text-blue-600">.</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Özünüzə ən uyğun müəllimi xəritədə tapın, dərslərinizi rahatlıqla planlayın və uğura gedən yolu birlikdə asanlaşdıraq.
            </p>
          </div>

          {/* Orta */}
          <div className="flex flex-col space-y-3 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition">Ana Səhifə</Link>
            <Link href="/map" className="hover:text-blue-600 transition">Xəritə ilə Axtar</Link>
            <Link href="/about" className="hover:text-blue-600 transition">Haqqımızda</Link>
          </div>

          {/* Sağ */}
          <div className="flex flex-col space-y-3 text-sm font-semibold text-slate-600">
            <Link href="/students" className="hover:text-blue-600 transition">Şagirdlər üçün</Link>
            <Link href="/teachers" className="hover:text-blue-600 transition">Müəllimlər üçün</Link>
            <Link href="/security" className="hover:text-blue-600 transition">Təhlükəsizlik və Qaydalar</Link>
          </div>

        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 text-center text-xs text-slate-400 font-medium">
          © {new Date().getFullYear()} Hazırlıqlar Platforması. Bütün hüquqlar qorunur.
        </div>
      </div>
    </footer>
  );
}