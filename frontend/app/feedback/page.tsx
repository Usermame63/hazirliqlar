"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FeedbackPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setUserRole(role);

    const savedFeedbacks = localStorage.getItem("siteFeedbacks");
    if (savedFeedbacks) {
      setFeedbacks(JSON.parse(savedFeedbacks));
    } else {
      setFeedbacks([
        {
          id: 1,
          author: "Elgün Ə.",
          role: "Müəllim",
          rating: 5,
          text: "Xəritə sistemi və peyk görüntüsü mükəmməl işləyir. Sayt çox sürətlidir, təşəkkürlər!",
          date: "2 saat əvvəl",
          replies: [
            { id: 101, author: "Admin", role: "Admin", text: "Təşəkkür edirik, Elgün müəllim. Uğurlar arzulayırıq.", date: "1 saat əvvəl" }
          ]
        },
        {
          id: 2,
          author: "Aysel Q.",
          role: "Şagird",
          rating: 4,
          text: "Sayt çox qəşəngdir, amma qeydiyyat zamanı profil şəkli qoymaq funksiyası da olsa super olar.",
          date: "1 gün əvvəl",
          replies: []
        }
      ]);
    }
  }, []);

  useEffect(() => {
    if (feedbacks.length > 0) {
      localStorage.setItem("siteFeedbacks", JSON.stringify(feedbacks));
    }
  }, [feedbacks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Zəhmət olmasa ulduz seçin.");
    if (!comment.trim()) return alert("Zəhmət olmasa rəyinizi yazın.");

    let displayRole = "Şagird";
    let authorName = "Siz (Yeni İstifadəçi)";

    if (userRole === "ADMIN") {
      displayRole = "Admin";
      authorName = "Admin";
    } else if (userRole === "TEACHER") {
      displayRole = "Müəllim";
    }

    const newFeedback = {
      id: Date.now(),
      author: authorName,
      role: displayRole,
      rating: rating,
      text: comment,
      date: "İndi",
      replies: []
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setRating(0);
    setComment("");
    alert("Rəyiniz uğurla əlavə edildi.");
  };

  const handleReplySubmit = (feedbackId: number) => {
    if (!replyText.trim()) return;

    let displayRole = "Şagird";
    let authorName = "Siz";

    if (userRole === "ADMIN") {
      displayRole = "Admin";
      authorName = "Admin";
    } else if (userRole === "TEACHER") {
      displayRole = "Müəllim";
    }

    const updatedFeedbacks = feedbacks.map(fb => {
      if (fb.id === feedbackId) {
        return {
          ...fb,
          replies: [...fb.replies, {
            id: Date.now(),
            author: authorName,
            role: displayRole,
            text: replyText,
            date: "İndi"
          }]
        };
      }
      return fb;
    });

    setFeedbacks(updatedFeedbacks);
    setReplyingToId(null);
    setReplyText("");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      
      {/* TƏTBİQ BAŞLIĞI */}
      <header className="bg-white px-5 pt-12 pb-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] z-10 relative mb-4">
        <h1 className="text-xl font-bold text-slate-900">Rəylər</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">İstifadəçi fikirləri və təkliflər</p>
      </header>

      <div className="px-4 max-w-2xl mx-auto space-y-6">
        
        {/* YENİ RƏY YAZMAQ ÜÇÜN FORMA (Kompakt) */}
        {isLoggedIn ? (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-700">Qiymət verin:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="focus:outline-none transition-transform active:scale-90">
                    <svg className={`w-7 h-7 ${star <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Fikirlərinizi yazın..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[90px] resize-y mb-3"></textarea>
            
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl active:bg-blue-700 transition text-sm">
              Rəyi Göndər
            </button>
          </form>
        ) : (
          <div className="bg-slate-100 p-5 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
            <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <p className="text-xs text-slate-600 font-bold mb-3">Rəy yazmaq və ya cavab vermək üçün sistemə daxil olmalısınız.</p>
            <Link href="/login" className="bg-white border border-slate-300 text-slate-800 font-bold py-2.5 px-6 rounded-xl active:bg-slate-50 transition text-xs">
              Daxil ol
            </Link>
          </div>
        )}

        {/* RƏYLƏRİN SİYAHISI */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-sm font-bold text-slate-800">Bütün Rəylər</h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{feedbacks.length} nəticə</span>
          </div>
          
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 text-slate-700 font-bold rounded-full flex items-center justify-center text-sm border border-slate-200 flex-shrink-0">
                    {fb.author[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      {fb.author} 
                      <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                        {fb.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{fb.date}</div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-3.5 h-3.5 ${i < fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  ))}
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed mb-3">{fb.text}</p>

              {isLoggedIn && (
                <button onClick={() => setReplyingToId(replyingToId === fb.id ? null : fb.id)} className="text-xs font-bold text-slate-500 active:text-blue-600 transition flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg> 
                  Cavabla
                </button>
              )}

              {/* CAVAB YAZMAQ ÜÇÜN FORMA */}
              {replyingToId === fb.id && (
                <div className="mt-3 flex gap-2">
                  <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Cavabınızı yazın..." className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs"/>
                  <button onClick={() => handleReplySubmit(fb.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs active:bg-blue-700 transition">Göndər</button>
                </div>
              )}

              {/* YAZILMIŞ CAVABLAR */}
              {fb.replies.length > 0 && (
                <div className="mt-3 space-y-2 pl-3 border-l-2 border-slate-200">
                  {fb.replies.map((reply: any) => (
                    <div key={reply.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-xs text-slate-800">{reply.author}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold bg-white border border-slate-200 text-slate-500">
                          {reply.role === 'Admin' ? 'ADMIN' : reply.role}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium ml-auto">{reply.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
}