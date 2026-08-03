"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function PlayGamePage() {
  const router = useRouter();

  // Ekran vəziyyətləri: "categories", "ai_loading", "playing", "finished"
  const [screen, setScreen] = useState("categories");
  
  // Artıq suallar AI-dən gələcək, tək-tək (və ya neçə sual istəyirsənsə)
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [score, setScore] = useState(0);
  const [earnedMoney, setEarnedMoney] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Lokal balans (Ana səhifə və Cüzdanla sinxron olmaq üçün)
  const [globalBalance, setGlobalBalance] = useState(0.00);

  useEffect(() => {
    // Cüzdandakı balansı oxuyuruq
    const savedBalance = parseFloat(localStorage.getItem("app_balance") || "0");
    setGlobalBalance(savedBalance);
  }, []);

  const REWARD_PER_QUESTION = 0.05;

  // Hər oyun üçün AI-dən sual gətirən əsas funksiya
  const fetchQuestionFromAI = async (category: string) => {
    try {
      // Backend-dəki yeni oyun API-mizə müraciət edirik (Burada öz domain-i yazacaqsan, indi Render linkini qoymuşam nümunə kimi)
      const res = await axios.post("https://hazirliqlar-backend.onrender.com/api/game/generate-question", {
        category: category,
        difficulty: "çətin" // İndi ancaq çətin suallar versin ki, asan pul qazanmasınlar
      });

      // Backend-in qaytardığı JSON formatındakı sualı ( {question, options, answer} ) bizim sistemin formatına ( {q, o, a} ) çeviririk
      const data = res.data;
      return {
        q: data.question,
        o: data.options,
        a: data.answer
      };

    } catch (error) {
      console.error("AI sual gətirə bilmədi:", error);
      // Əgər xəta olarsa və ya AI cavab verməsə, ehtiyat olaraq (fallback) bir sual
      return {
        q: "Sistemə qoşulma xətası. Azərbaycanda neçə iqlim qurşağı var?",
        o: ["7", "9", "11", "5"],
        a: "9"
      };
    }
  };

  const handleCategorySelect = async (categoryKey: string) => {
    setScreen("ai_loading");
    
    // AI-dən 3 ədəd canlı sual gətiririk (Oyunun 3 mərhələli olması üçün)
    // Bunu etmək üçün Promise.all istifadə edib eyni anda 3 fərqli sual istəyirik
    const questionsArr = await Promise.all([
      fetchQuestionFromAI(categoryKey),
      fetchQuestionFromAI(categoryKey),
      fetchQuestionFromAI(categoryKey)
    ]);
    
    setCurrentQuestions(questionsArr);
    setCurrentQuestionIndex(0);
    setScore(0);
    setEarnedMoney(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScreen("playing");
  };

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(option);
    const correct = option === currentQuestions[currentQuestionIndex].a;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      setEarnedMoney(prev => prev + REWARD_PER_QUESTION);
    }

    setTimeout(() => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setScreen("finished");
      }
    }, 1500); // Reaksiyanı görmək üçün bir az fasilə
  };

  const finishAndSave = () => {
    // Qazanılan pulu ümumi balansa əlavə edib yaddaşda saxlayırıq (Real-time update üçün)
    const newTotal = globalBalance + earnedMoney;
    localStorage.setItem("app_balance", newTotal.toString());
    
    router.push("/wallet");
  };

  // Kateqoriyalar üçün təmiz SVG ikonlar
  const icons = {
    math: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>,
    logic: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>,
    tech: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      
      {/* ÜST BAŞLIQ */}
      <header className="bg-white px-5 pt-12 pb-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] shrink-0">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full active:scale-95 transition-transform text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">Bilik Oyunları</h1>
        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 font-bold px-3 py-1.5 rounded-full text-sm border border-green-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {(globalBalance + earnedMoney).toFixed(2)} ₼
        </div>
      </header>

      <main className="flex-1 flex flex-col px-5 py-6 max-w-lg mx-auto w-full">
        
        {/* 1. KATEQORİYALAR SİYAHISI */}
        {screen === "categories" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 pl-1">Oyun Otaqları</h2>
            
            <div className="space-y-4">
              
              <button onClick={() => handleCategorySelect('math')} className="w-full bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-95 transition-all group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {icons.math}
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-slate-900 text-base">Riyaziyyat</h3>
                  <p className="text-xs text-slate-500 mt-1">Dəqiq elmlər və hesablamalar</p>
                </div>
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>

              <button onClick={() => handleCategorySelect('logic')} className="w-full bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-95 transition-all group">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  {icons.logic}
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-slate-900 text-base">Məntiq və Zəka</h3>
                  <p className="text-xs text-slate-500 mt-1">Düşündürücü və çətin tapmacalar</p>
                </div>
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>

              <button onClick={() => handleCategorySelect('tech')} className="w-full bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-95 transition-all group">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {icons.tech}
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-slate-900 text-base">Elm və Texnologiya</h3>
                  <p className="text-xs text-slate-500 mt-1">İT, proqramlaşdırma və innovasiyalar</p>
                </div>
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>

            </div>
          </div>
        )}

        {/* 2. SÜNİ İNTELLEKT YÜKLƏMƏ EKRANI */}
        {screen === "ai_loading" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              </div>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Süni İntellekt İşləyir</h2>
            <p className="text-sm text-slate-500 max-w-[250px]">Şəbəkədən sizin üçün xüsusi, ən çətin və fərqli suallar toplanır...</p>
          </div>
        )}

        {/* 3. OYUN EKRANI */}
        {screen === "playing" && (
          <div className="w-full flex-1 flex flex-col justify-center animate-in fade-in duration-300 pb-10">
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Sual {currentQuestionIndex + 1} / {currentQuestions.length}
              </span>
              <div className="flex gap-1.5">
                {currentQuestions.map((_, idx) => (
                  <div key={idx} className={`w-8 h-1.5 rounded-full transition-colors ${idx <= currentQuestionIndex ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {currentQuestions[currentQuestionIndex].q}
              </h3>
            </div>

            <div className="space-y-3">
              {currentQuestions[currentQuestionIndex].o.map((option: string, index: number) => {
                let buttonStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
                
                if (selectedAnswer !== null) {
                  const isThisCorrectOption = option === currentQuestions[currentQuestionIndex].a;
                  const isThisSelectedOption = option === selectedAnswer;

                  if (isThisCorrectOption) {
                    buttonStyle = "bg-green-50 border-green-500 text-green-700";
                  } else if (isThisSelectedOption && !isCorrect) {
                    buttonStyle = "bg-red-50 border-red-500 text-red-700";
                  } else {
                    buttonStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-semibold transition-all ${buttonStyle} flex justify-between items-center`}
                  >
                    <span>{option}</span>
                    
                    {selectedAnswer !== null && option === currentQuestions[currentQuestionIndex].a && (
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    )}
                    {selectedAnswer !== null && option === selectedAnswer && !isCorrect && (
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. NƏTİCƏ VƏ BALANS YÜKLƏMƏ EKRANI */}
        {screen === "finished" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 border border-green-100">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Əla Nəticə!</h2>
            <p className="text-sm text-slate-500 mb-8">
              Siz {currentQuestions.length} sualdan <span className="font-bold text-slate-900">{score} doğru</span> cavab verdiniz.
            </p>
            
            <div className="bg-white border border-slate-200 p-6 rounded-3xl w-full mb-8 shadow-sm">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Qazanılan Məbləğ</p>
              <p className="text-4xl font-black text-slate-900">{earnedMoney.toFixed(2)} <span className="text-2xl text-slate-400 font-bold">₼</span></p>
            </div>

            <div className="w-full space-y-3">
              <button onClick={finishAndSave} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl transition shadow-md shadow-slate-900/20 text-sm">
                Balansa Əlavə Et
              </button>
              <button onClick={() => setScreen("categories")} className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-xl transition hover:bg-slate-50 text-sm">
                Başqa Otağa Keç
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}