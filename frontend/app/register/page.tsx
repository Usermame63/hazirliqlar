"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState("STUDENT"); // Default olaraq Şagird
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // Müəllimlər üçün əlavə sahələr:
    phone: "",
    fatherName: "", 
    motherName: "", 
    subject: "",    
    price: "",      
    experience: ""  
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Backend-ə məlumatları göndərməzdən əvvəl rəqəmləri Number() ilə çeviririk
      await axios.post("https://hazirliqlar-backend.onrender.com/api/auth/register", {
        ...formData,
        role: role,
        // Prisma-nın xəta verməməsi üçün mətnləri riyazi rəqəmə (Int) çeviririk:
        experience: Number(formData.experience || 0),
        pricePerMonth: Number(formData.price || 0), 
        price: Number(formData.price || 0) 
      });

      // Uğurlu olduqda giriş səhifəsinə yönləndiririk
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Qeydiyyat zamanı xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        
        {/* Loqo və Başlıq */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-blue-600 tracking-tighter">
            Hazırlıqlar<span className="text-slate-900">.</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            Platformaya qoşulun
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Artıq hesabınız var?{" "}
            <Link href="/login" className="font-bold text-blue-600 hover:text-blue-500 transition">
              Sistemə daxil olun
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-slate-100">
          
          {/* ROL SEÇİMİ (Şagird / Müəllim) */}
          <div className="flex gap-4 mb-8 p-1 bg-slate-100 rounded-2xl">
            <button 
              type="button" 
              onClick={() => setRole('STUDENT')} 
              className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${role === 'STUDENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
              Şagird
            </button>
            <button 
              type="button" 
              onClick={() => setRole('TEACHER')} 
              className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${role === 'TEACHER' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Müəllim
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold text-sm text-center border border-red-100 animate-pulse">
                {error}
              </div>
            )}

            {/* Ümumi Sahələr (Həm Şagird, həm Müəllim üçün) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Adınız</label>
                <input required name="firstName" type="text" value={formData.firstName} onChange={handleChange} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition" placeholder="Ad" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Soyadınız</label>
                <input required name="lastName" type="text" value={formData.lastName} onChange={handleChange} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition" placeholder="Soyad" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">E-poçt ünvanı</label>
              <input required name="email" type="email" value={formData.email} onChange={handleChange} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition" placeholder="Nümunə: admin@gmail.com" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Şifrə</label>
              <input required name="password" type="password" value={formData.password} onChange={handleChange} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition" placeholder="••••••••" />
            </div>

            {/* --- MÜƏLLİMLƏR ÜÇÜN ƏLAVƏ SAHƏLƏR --- */}
            {role === "TEACHER" && (
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">!</span>
                  <p className="text-sm font-bold text-slate-600">Peşəkar fəaliyyətiniz üçün əlavə məlumatlar tələb olunur:</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Ata adı</label>
                    <input required name="fatherName" type="text" value={formData.fatherName} onChange={handleChange} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition" placeholder="Ata adı" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Ana adı</label>
                    <input required name="motherName" type="text" value={formData.motherName} onChange={handleChange} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition" placeholder="Ana adı" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Mobil Nömrə</label>
                  <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition" placeholder="Məs: 050 123 45 67" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tədris Fənni</label>
                    <input required name="subject" type="text" value={formData.subject} onChange={handleChange} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition" placeholder="Məs: Riyaziyyat" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Qiymət (Aylıq / AZN)</label>
                    <input required name="price" type="number" value={formData.price} onChange={handleChange} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition" placeholder="Məs: 80" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Təcrübə (Neçə il?)</label>
                  <input required name="experience" type="number" value={formData.experience} onChange={handleChange} className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition" placeholder="Məs: 5" />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-200 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Qeydiyyatı Tamamla"
                )}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}