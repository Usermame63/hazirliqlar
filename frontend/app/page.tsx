"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [userName, setUserName] = useState("Qonaq");
  const [greeting, setGreeting] = useState("Xoş gəldiniz");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Real və sinxron balans sistemi
  const [balance, setBalance] = useState(0.00); 

  const [topTeachers, setTopTeachers] = useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Bütün");

  const categories = ["Bütün", "Riyaziyyat", "İngilis dili", "Proqramlaşdırma", "Məntiq", "Fizika"];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Sabahın xeyir");
    else if (hour >= 12 && hour < 18) setGreeting("Günortan xeyir");
    else if (hour >= 18 && hour < 23) setGreeting("Axşamın xeyir");
    else setGreeting("Gecən xeyir");

    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const token = localStorage.getItem("token");
    
    if (token) {
      setIsLoggedIn(true);
      // Oyundan və cüzdandan qayıdanda ən son balansı dərhal oxuyur
      const savedBalance = localStorage.getItem("app_balance");
      setBalance(savedBalance ? parseFloat(savedBalance) : 0.00);
    }
    
    if (firstName && lastName) {
      setUserName(`${firstName} ${lastName}`);
    } else if (firstName) {
      setUserName(firstName);
    }

    const fetchTopTeachers = async () => {
      try {
        const res = await axios.get("https://hazirliqlar-backend.onrender.com/api/admin/users");
        const teachersOnly = res.data.filter((u: any) => u.role === "TEACHER");
        setTopTeachers(teachersOnly.slice(0, 4));
      } catch (error) {
        setTopTeachers([
          { id: "1", firstName: "Elgün", lastName: "Ə.", email: "Riyaziyyat" },
          { id: "2", firstName: "Aysel", lastName: "M.", email: "İngilis dili" },
        ]);
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTopTeachers();
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (typeof window !== "undefined" && window.scrollY === 0) setStartY(e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY > 0 && typeof window !== "undefined" && window.scrollY === 0) {
      const distance = e.touches[0].clientY - startY;
      if (distance > 0) setPullDistance(Math.min(distance, 85));
    }
  };
  const handleTouchEnd = () => {
    if (pullDistance >= 65) {
      setIsRefreshing(true);
      setTimeout(() => window.location.reload(), 400);
    } else {
      setPullDistance(0);
      setStartY(0);
    }
  };

  return (
    <div 
      className="min-h-screen bg-white font-sans relative overflow-hidden text-slate-800"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Sənin yellənən şəkil animasiyan üçün CSS */}
      <style>{`
        @keyframes swing-plate {
          0% { transform: rotate(4deg); }
          100% { transform: rotate(-3deg); }
        }
        .animate-swing {
          transform-origin: top center;
          animation: swing-plate 3.5s ease-in-out infinite alternate;
        }
        .confetti-bg {
          background-image: radial-gradient(#3b82f6 2px, transparent 2px), radial-gradient(#ef4444 2px, transparent 2px), radial-gradient(#f59e0b 2px, transparent 2px);
          background-size: 30px 30px, 40px 40px, 50px 50px;
          background-position: 0 0, 15px 15px, 25px 25px;
          opacity: 0.1;
        }
      `}</style>

      {/* PULL TO REFRESH */}
      <div className="absolute top-0 left-0 w-full flex justify-center items-end pb-5 transition-all duration-200 z-0 bg-slate-50" style={{ height: `${pullDistance}px`, opacity: pullDistance / 80 }}>
        {isRefreshing || pullDistance >= 65 ? (
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-200 border-t-slate-800"></div>
        ) : (
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        )}
      </div>

      <div className="bg-white min-h-screen pb-24 relative z-10" style={{ transform: `translateY(${pullDistance}px)`, transition: pullDistance === 0 && !isRefreshing ? 'transform 0.3s ease-out' : 'none' }}>
        
        {/* APP HEADER - YENİ BALANS SİSTEMİ İLƏ */}
        <header className="px-6 pt-12 pb-5 border-b border-slate-50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-1">{greeting}</p>
              <h1 className="text-xl font-bold text-slate-900 truncate max-w-[180px] tracking-tight">{userName}</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* YENİ: Balans Göstəricisi */}
              {isLoggedIn && (
                <Link href="/wallet" className="flex items-center gap-1.5 bg-green-50 text-green-700 font-bold px-3 py-1.5 rounded-full text-sm border border-green-200 active:scale-95 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {balance.toFixed(2)} ₼
                </Link>
              )}

              {isLoggedIn ? (
                <Link href="/profile" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 active:scale-95 transition-transform shadow-sm">
                  <span className="font-bold text-sm">{userName !== "Qonaq" ? userName.charAt(0).toUpperCase() : "U"}</span>
                </Link>
              ) : (
                <Link href="/login" className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-full active:scale-95 transition-transform shadow-sm">
                  Giriş
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus-within:border-slate-300 transition-colors">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Fənn və ya müəllim axtar..." className="bg-transparent w-full ml-3 outline-none text-slate-700 text-sm placeholder-slate-400" />
          </div>
        </header>

        <main className="pt-5 space-y-8">
          
          {/* ÜFÜQİ KATEQORİYALAR */}
          <div className="px-6">
            <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-colors border ${activeCategory === cat ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-600 border-slate-200 active:bg-slate-50"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* OYNA QAZAN BÖLMƏSİ (Şarlar, Fişənglər və Asılı Şəkil) */}
          <div className="px-6 relative">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 text-center border border-blue-100 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 confetti-bg"></div>
              <div className="absolute top-2 left-2 text-2xl animate-bounce">🎈</div>
              <div className="absolute bottom-4 right-3 text-2xl animate-pulse">🎉</div>
              
              <div className="relative z-10">
                <span className="inline-block bg-orange-100 text-orange-600 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest mb-3 border border-orange-200">
                  Yeni Güncəlləmə! 🎁
                </span>
                
                <h2 className="text-xl font-black text-slate-900 mb-1 leading-tight">YENİ GƏLMƏDİK,<br/><span className="text-blue-600">GERİ GƏLDİK!</span></h2>
                <p className="text-xs text-slate-500 font-medium mb-6">Bilik yarışmalarına qatıl, cavabla və sən də real pul qazan!</p>

                {/* YELLƏNƏN ŞƏKİL ANİMASİYASI */}
                <div className="relative mx-auto w-64 h-40 mb-6">
                  {/* Yuxarıdan tutan əl / İp simulyasiyası */}
                  <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-1 h-6 bg-slate-300 z-20 origin-top animate-swing">
                    <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 text-xl">🖐️</div>
                  </div>
                  
                  {/* Yellənən Şəkil Konteyneri */}
                  <div className="w-full h-full animate-swing shadow-lg rounded-2xl overflow-hidden border-4 border-white bg-slate-100 flex items-center justify-center">
                    <img 
                      src="/image_b8275d.jpg" 
                      alt="Bilik Yarışması" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>

                <Link href="/play" className="inline-block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black py-3.5 rounded-xl transition shadow-lg shadow-blue-500/30 text-sm">
                  İndi Oyna və Qazan! 🎮
                </Link>
              </div>
            </div>
          </div>

          {/* HƏFTƏNİN MÜƏLLİMLƏRİ */}
          <div className="space-y-4">
            <div className="px-6 flex justify-between items-end">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Həftənin Müəllimləri 🌟</h2>
              <Link href="/teachers" className="text-[11px] font-bold text-blue-600 active:text-blue-800">Hamısına bax</Link>
            </div>

            <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {loadingTeachers ? (
                [1, 2, 3].map((n) => (
                  <div key={n} className="min-w-[240px] snap-center bg-slate-50 border border-slate-100 p-4 rounded-2xl animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                      <div className="space-y-2"><div className="h-3 w-20 bg-slate-200 rounded"></div><div className="h-2 w-16 bg-slate-200 rounded"></div></div>
                    </div>
                  </div>
                ))
              ) : topTeachers.length > 0 ? (
                topTeachers.map((teacher) => (
                  <Link key={teacher.id || teacher._id} href={`/teachers/${teacher.id || teacher._id}`} className="min-w-[240px] snap-center bg-white border border-slate-100 p-4 rounded-2xl shadow-sm active:bg-slate-50 transition-colors block">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 font-bold rounded-full flex items-center justify-center border border-blue-100 text-lg flex-shrink-0">
                        {teacher.firstName ? teacher.firstName[0].toUpperCase() : "M"}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{teacher.firstName} {teacher.lastName}</h3>
                        <p className="text-[11px] text-slate-500 font-medium">{teacher.email.includes("@") ? "Peşəkar Müəllim" : teacher.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <svg className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                          <span className="text-[10px] font-bold text-slate-700">5.0</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="min-w-full text-center text-sm text-slate-400 py-4">Hələ müəllim əlavə edilməyib.</div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}