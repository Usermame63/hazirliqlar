"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // BİRBAŞA GİRİŞ (OTP LƏĞV EDİLDİ)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Backend-ə birbaşa sorğu göndəririk
      const res = await axios.post("https://hazirliqlar-backend.onrender.com/api/auth/login", { email, password });
      
      const data = res.data;
      
      // Token, rol və İSTİFADƏÇİ ADINI yaddaşa yazırıq və birbaşa ana səhifəyə keçirik
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      
      // YENİ ƏLAVƏ EDİLƏN KODLAR: Ad və Soyad
      if (data.user.firstName) localStorage.setItem("firstName", data.user.firstName);
      if (data.user.lastName) localStorage.setItem("lastName", data.user.lastName);
      
      router.push("/");

    } catch (err: any) {
      setError(err.response?.data?.message || "E-poçt və ya şifrə yanlışdır!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-blue-600 tracking-tighter">
            Hazırlıqlar<span className="text-slate-900">.</span>
          </Link>
        </div>

        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-slate-100 overflow-hidden relative">
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Xoş Gəlmisiniz! 👋</h2>
              <p className="text-sm text-slate-500">Hesabınıza daxil olaraq davam edin</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold text-sm text-center border border-red-100 mb-5 animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">E-poçt ünvanı</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition" 
                  placeholder="mail@numune.com" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-bold text-slate-700">Şifrə</label>
                  <Link href="#" className="text-xs text-blue-600 font-bold hover:underline">Şifrəni unutmusunuz?</Link>
                </div>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition" 
                  placeholder="••••••••" 
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-3.5 border border-transparent rounded-xl shadow-lg shadow-blue-200 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50 flex justify-center"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Daxil Ol"}
                </button>
              </div>
            </form>

            <p className="text-center text-slate-500 text-sm mt-8 font-medium">
              Hesabınız yoxdur? <Link href="/register" className="text-blue-600 font-bold hover:underline">Qeydiyyatdan keçin</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}