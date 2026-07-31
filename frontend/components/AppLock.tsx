"use client";

import { useState, useEffect } from "react";

export default function AppLock({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState("loading");
  const [savedPin, setSavedPin] = useState("");
  const [inputPin, setInputPin] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState(false);
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [visibleLine, setVisibleLine] = useState(0);

  useEffect(() => {
    // Ad və Soyadı çəkirik
    const fName = localStorage.getItem("firstName") || "";
    const lName = localStorage.getItem("lastName") || "";
    const fullName = fName ? `${fName} ${lName}`.trim() : "Qonaq";
    setUserName(fullName);

    // Saata görə salamlaşma
    const hour = new Date().getHours();
    let greet = "Xoş gəldiniz";
    if (hour >= 5 && hour < 12) greet = "Sabahın xeyir";
    else if (hour >= 12 && hour < 18) greet = "Günortan xeyir";
    else if (hour >= 18 && hour < 23) greet = "Axşamın xeyir";
    else greet = "Gecən xeyir";
    setGreeting(greet);

    // PİN yoxlaması
    const pin = localStorage.getItem("app_pin");
    const isUnlocked = sessionStorage.getItem("app_unlocked"); // Proqramdan çıxıb girəndə sıfırlanır

    if (isUnlocked === "true") {
      setStep("unlocked");
    } else if (pin) {
      setSavedPin(pin);
      setStep("enter-pin"); // Əgər pin varsa və proqram təzə açılıbsa kodu istəyir
    } else {
      setStep("onboarding-1"); // İlk dəfə girirsə salamlama ekranı
    }
  }, []);

  // Animasiyalı mətnlərin sıra ilə gəlməsi (TimeOut)
  useEffect(() => {
    if (step === "onboarding-1") {
      setTimeout(() => setVisibleLine(1), 400);
      setTimeout(() => setVisibleLine(2), 1400);
      setTimeout(() => setVisibleLine(3), 2400);
    }
  }, [step]);

  const handleNumberClick = (num: string) => {
    if (inputPin.length < 4) {
      const newVal = inputPin + num;
      setInputPin(newVal);

      if (newVal.length === 4) {
        if (step === "enter-pin") {
          if (newVal === savedPin) {
            sessionStorage.setItem("app_unlocked", "true");
            setStep("unlocked");
          } else {
            setError(true);
            setTimeout(() => {
              setInputPin("");
              setError(false);
            }, 500);
          }
        } else if (step === "set-pin-1") {
          setFirstPin(newVal);
          setTimeout(() => {
            setInputPin("");
            setStep("set-pin-2");
          }, 300);
        } else if (step === "set-pin-2") {
          if (newVal === firstPin) {
            localStorage.setItem("app_pin", newVal);
            sessionStorage.setItem("app_unlocked", "true");
            setStep("unlocked");
          } else {
            setError(true);
            setTimeout(() => {
              setInputPin("");
              setFirstPin("");
              setError(false);
              setStep("set-pin-1"); // Səhvdirsə yenidən baştan istə
            }, 1000);
          }
        }
      }
    }
  };

  const handleDelete = () => setInputPin((prev) => prev.slice(0, -1));

  if (step === "loading") return <div className="fixed inset-0 bg-white z-[9999]"></div>;
  if (step === "unlocked") return <>{children}</>;

  // EKRAN 1: SIRA İLƏ GƏLƏN MƏTNLƏR
  if (step === "onboarding-1") {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col justify-center px-8 font-sans">
        <div className="space-y-6 flex-1 flex flex-col justify-center">
          <h1 className={`text-3xl font-black text-slate-900 transition-all duration-700 transform ${visibleLine >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Xoş gəldiniz! 👋
          </h1>
          <p className={`text-lg text-slate-600 font-medium transition-all duration-700 transform ${visibleLine >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Hazırlıqlar platformasına qoşulduğunuz üçün çox şadıq.
          </p>
          <p className={`text-lg text-slate-600 font-medium transition-all duration-700 transform ${visibleLine >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Gələcəyinizi peşəkarlarla qurmağa hazırsınız?
          </p>
        </div>
        
        <div className={`pb-12 transition-all duration-1000 ${visibleLine >= 3 ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <button onClick={() => setStep("onboarding-2")} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl active:bg-blue-700 transition">
            Növbəti
          </button>
        </div>
      </div>
    );
  }

  // EKRAN 2: TƏHLÜKƏSİZLİK VƏ YENİLİKLƏR
  if (step === "onboarding-2") {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col px-8 py-12 font-sans animate-in slide-in-from-right-8 duration-300">
        <div className="flex-1 flex flex-col justify-center space-y-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-2 shadow-sm border border-blue-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 leading-tight">Təhlükəsizlik<br/>İlk Yerdədir</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-50 text-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-slate-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Şəxsi PİN Kod</h3>
                <p className="text-sm text-slate-500 mt-1">Tətbiqə hər girişdə PİN kod tələb olunacaq ki, hesabınız güvəndə qalsın.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-50 text-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-slate-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Daimi Yenilənmə</h3>
                <p className="text-sm text-slate-500 mt-1">Sistemimiz daima yenilənir və sizə ən sürətli təcrübəni təqdim edir.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-4">
          <button onClick={() => setStep("set-pin-1")} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl active:bg-slate-800 transition shadow-lg shadow-slate-900/20">
            PİN Təyin Et
          </button>
        </div>
      </div>
    );
  }

  // PİN TƏYİN ETMƏ VƏ GİRİŞ EKRANLARI (Ağ Tema)
  let title = "";
  let subtitle = "";
  
  if (step === "set-pin-1") {
    title = "PİN Təyin Edin";
    subtitle = "Tətbiqə giriş üçün 4 rəqəmli şifrə yaradın";
  } else if (step === "set-pin-2") {
    title = "PİN-i Təsdiqləyin";
    subtitle = error ? "PİN-lər uyğun gəlmədi, yenidən sınayın" : "Yazdığınız PİN kodunu təkrar daxil edin";
  } else if (step === "enter-pin") {
    title = `${greeting}, ${userName}`;
    subtitle = error ? "PİN yalnışdır!" : "Tətbiqə daxil olmaq üçün PİN kodunuzu yazın";
  }

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center font-sans animate-in fade-in duration-300">
      
      <div className="w-16 h-16 bg-slate-50 text-slate-700 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
        {step === "enter-pin" ? (
          <span className="text-2xl font-black">{userName !== "Qonaq" ? userName.charAt(0).toUpperCase() : "🔒"}</span>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        )}
      </div>
      
      <h2 className="text-slate-900 text-2xl font-black mb-2 text-center max-w-[300px]">
        {title}
      </h2>
      <p className={`text-sm mb-10 text-center max-w-[250px] ${error ? "text-red-500 font-bold animate-pulse" : "text-slate-500"}`}>
        {subtitle}
      </p>

      {/* PİN Nöqtələri */}
      <div className={`flex gap-5 mb-14 ${error ? "animate-bounce" : ""}`}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`w-4 h-4 rounded-full transition-all duration-200 ${inputPin.length > i ? "bg-slate-800 scale-125" : "bg-slate-200"}`}></div>
        ))}
      </div>

      {/* Rəqəmsal Klaviatura */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button key={num} onClick={() => handleNumberClick(num.toString())} className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 text-slate-800 text-2xl font-semibold active:bg-slate-200 active:scale-95 transition flex items-center justify-center">
            {num}
          </button>
        ))}
        <div className="w-16 h-16"></div> {/* Boşluq */}
        <button onClick={() => handleNumberClick("0")} className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 text-slate-800 text-2xl font-semibold active:bg-slate-200 active:scale-95 transition flex items-center justify-center">
          0
        </button>
        <button onClick={handleDelete} className="w-16 h-16 rounded-full bg-transparent text-slate-500 text-xl font-medium active:bg-slate-100 active:scale-95 transition flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"></path></svg>
        </button>
      </div>
    </div>
  );
}