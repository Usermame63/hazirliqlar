"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const router = useRouter();
  
  // Balans state-i
  const [balance, setBalance] = useState(0.00); 
  
  const [selectedMethod, setSelectedMethod] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const methods = [
    { id: "m10", name: "m10", color: "bg-red-50 text-red-600 border-red-100" },
    { id: "birbank", name: "Birbank", color: "bg-red-50 text-red-600 border-red-100" },
    { id: "leobank", name: "Leobank", color: "bg-slate-900 text-yellow-400 border-slate-800" },
    { id: "kapital", name: "Kapital Bank", color: "bg-red-50 text-red-600 border-red-100" },
    { id: "pasha", name: "PAŞA Bank", color: "bg-teal-50 text-teal-600 border-teal-100" },
    { id: "unibank", name: "Unibank", color: "bg-orange-50 text-orange-600 border-orange-100" },
    { id: "mpay", name: "mPay", color: "bg-blue-50 text-blue-600 border-blue-100" },
  ];

  const [history, setHistory] = useState<any[]>([]);

  // Ana səhifədəki və oyundakı pulla sinxronlaşdırmaq üçün
  useEffect(() => {
    const saved = localStorage.getItem("app_balance");
    if (saved) setBalance(parseFloat(saved));
  }, []);

  // Təmiz SVG ikonlar
  const getMethodIcon = (id: string) => {
    if (id === "m10" || id === "mpay") {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      );
    }
    if (id === "birbank" || id === "leobank" || id === "unibank") {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
      </svg>
    );
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawAmount);

    if (!selectedMethod) {
      setStatusMessage("Lütfən, çıxarış üsulunu seçin.");
      return;
    }
    if (accountNumber.length < 5) {
      setStatusMessage("Kart və ya nömrəni düzgün daxil edin.");
      return;
    }
    if (isNaN(amount) || amount < 1) {
      setStatusMessage("Minimum çıxarış məbləği 1.00 AZN olmalıdır.");
      return;
    }
    if (amount > balance) {
      setStatusMessage("Balansınızda kifayət qədər məbləğ yoxdur.");
      return;
    }

    setStatusMessage("");
    setShowSuccess(true);
    
    // YENİ: Balansdan çıxıb yaddaşda saxlayırıq ki, ana səhifədə də azalsın
    const newBalance = balance - amount;
    setBalance(newBalance);
    localStorage.setItem("app_balance", newBalance.toString());
    
    // Real olaraq əməliyyat edildikdə tarixçəyə düşür
    const newRecord = {
      id: Date.now(),
      method: methods.find(m => m.id === selectedMethod)?.name || selectedMethod,
      amount: amount,
      date: "İndi",
      status: "Gözləyir"
    };
    setHistory([newRecord, ...history]);

    setTimeout(() => {
      setShowSuccess(false);
      setWithdrawAmount("");
      setAccountNumber("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24">
      
      <header className="bg-white px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full active:scale-95 transition-transform text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">Mənim Cüzdanım</h1>
        <div className="w-10"></div>
      </header>

      <main className="px-5 pt-6 max-w-lg mx-auto space-y-6">
        
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-900/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-5 translate-x-1/2 -translate-y-1/2"></div>
          
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Cari Balans</p>
          <h2 className="text-4xl font-black mb-6 tracking-tight">{balance.toFixed(2)} <span className="text-2xl text-slate-400">₼</span></h2>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Oyunlardan qazanılan</p>
              <p className="text-sm font-bold">Hazırlıqlar Pay</p>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Vəsaiti Çıxar
          </h3>
          
          <form onSubmit={handleWithdraw} className="space-y-4">
            
            {statusMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {statusMessage}
              </div>
            )}

            {showSuccess && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-xs font-bold text-center border border-green-200 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="text-sm">Çıxarış sorğusu qəbul edildi</span>
                </div>
                <span className="text-green-600 font-medium block">Məbləğ 24 saat içində balansınıza yüklənəcək.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Çıxarış Üsulu</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMethod(m.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      selectedMethod === m.id 
                        ? `${m.color} ring-2 ring-current scale-95` 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {getMethodIcon(m.id)}
                    <span className="text-[10px] font-bold">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Kart və ya Mobil Nömrə</label>
              <input 
                type="text" 
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Məs: 4169 **** **** 1234 və ya 0501234567" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700">Məbləğ (AZN)</label>
                <span className="text-[10px] font-bold text-slate-400">Min. 1.00 ₼</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₼</span>
                <input 
                  type="number" 
                  step="0.10"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
            </div>

            <button type="submit" className="w-full mt-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white font-black py-3.5 rounded-xl transition shadow-md shadow-slate-900/20 text-sm">
              Çıxarış Et
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-3">Əməliyyat Tarixçəsi</h3>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
            
            {history.length > 0 ? history.map((item) => (
              <div key={item.id} className="p-4 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    {getMethodIcon(item.method.toLowerCase())}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.method}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-black text-slate-900">- {item.amount.toFixed(2)} ₼</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                    item.status === "Tamamlandı" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-sm text-slate-400 font-medium">
                Hələ heç bir çıxarış yoxdur.
              </div>
            )}
            
          </div>
        </div>

      </main>
    </div>
  );
}