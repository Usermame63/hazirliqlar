"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, verifyOtp } from "../../services/auth";

export default function Login() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // MƏRHƏLƏ 1: Şifrəni göndər və Mailə kod gəlsin
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      // Şifrə düzdürsə və mail getdisə, 2-ci mərhələyə keç
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "E-poçt və ya şifrə yanlışdır!");
    } finally {
      setLoading(false);
    }
  };

  // MƏRHƏLƏ 2: E-poçta gələn real kodu yoxla
  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await verifyOtp(email, otp);
      
      // Kod düzdür! İcazə verildi, Tokeni yaddaşa yaz.
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Daxil etdiyiniz təhlükəsizlik kodu yanlışdır!");
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
          
          {step === 1 && (
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
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="mail@numune.com" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-bold text-slate-700">Şifrə</label>
                    <Link href="#" className="text-xs text-blue-600 font-bold hover:underline">Şifrəni unutmusunuz?</Link>
                  </div>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="••••••••" />
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={loading} className="w-full py-3.5 border border-transparent rounded-xl shadow-lg shadow-blue-200 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50 flex justify-center">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Daxil Ol"}
                  </button>
                </div>
              </form>

              <p className="text-center text-slate-500 text-sm mt-8 font-medium">
                Hesabınız yoxdur? <Link href="/register" className="text-blue-600 font-bold hover:underline">Qeydiyyatdan keçin</Link>
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">2-Mərhələli Təsdiq</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Təhlükəsizlik məqsədilə <b>{email}</b> ünvanına 4 rəqəmli kod göndərdik. Hesaba giriş etmək üçün kodu aşağıya yazın.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold text-sm text-center border border-red-100 mb-5 animate-pulse">
                  {error}
                </div>
              )}

              <form onSubmit={handleOTPVerify} className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    required 
                    maxLength={4} 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                    className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-center text-3xl font-black tracking-[1em]" 
                    placeholder="••••" 
                  />
                </div>

                <button type="submit" disabled={loading || otp.length < 4} className="w-full py-4 border border-transparent rounded-xl shadow-lg shadow-green-200 text-base font-bold text-white bg-green-600 hover:bg-green-700 transition-all disabled:opacity-50 flex justify-center">
                  {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Təsdiqlə və Daxil Ol"}
                </button>

                <button type="button" onClick={() => {setStep(1); setOtp(""); setError("");}} className="w-full text-center text-sm text-slate-500 font-bold hover:text-slate-700 transition">
                  Geri Qayıt
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}