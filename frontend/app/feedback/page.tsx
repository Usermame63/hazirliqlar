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

  // 1. Səhifə yüklənəndə Rəyləri YADDAŞDAN oxuyuruq
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setUserRole(role);

    const savedFeedbacks = localStorage.getItem("siteFeedbacks");
    if (savedFeedbacks) {
      // Yaddaşda rəy varsa, onları gətiririk
      setFeedbacks(JSON.parse(savedFeedbacks));
    } else {
      // Yoxdursa, başlanğıc üçün 2 dənə nümunə rəy göstəririk
      setFeedbacks([
        {
          id: 1,
          author: "Elgün Ə.",
          role: "Müəllim",
          rating: 5,
          text: "Xəritə sistemi və peyk görüntüsü mükəmməl işləyir. Sayt çox sürətlidir, təşəkkürlər!",
          date: "2 saat əvvəl",
          replies: [
            { id: 101, author: "Admin", role: "Admin", text: "Təşəkkür edirik, Elgün müəllim! Uğurlar arzulayırıq.", date: "1 saat əvvəl" }
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

  // 2. Rəylər hər dəfə dəyişəndə (yeni rəy və ya yanıt yazılanda) YADDAŞA yazırıq
  useEffect(() => {
    if (feedbacks.length > 0) {
      localStorage.setItem("siteFeedbacks", JSON.stringify(feedbacks));
    }
  }, [feedbacks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Zəhmət olmasa ulduz seçin!");
    if (!comment.trim()) return alert("Zəhmət olmasa rəyinizi yazın!");

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
    alert("Rəyiniz uğurla əlavə edildi!");
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900">Platforma Haqqında <span className="text-blue-600">Rəylər</span></h1>
          <p className="text-slate-500 text-lg">Problemləri bildirin, xətaları yazın və ya sadəcə saytı qiymətləndirin.</p>
        </div>

        {isLoggedIn ? (
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Öz rəyinizi bildirin</h3>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-bold text-slate-500 mr-2">Qiymətiniz:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="focus:outline-none transition-transform hover:scale-110">
                  <svg className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
              ))}
            </div>

            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Saytda bəyəndiyiniz və ya problem yaşadığınız hissələri yazın..." className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition min-h-[120px] resize-y mb-4"></textarea>
            
            <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">Rəyi Göndər</button>
          </form>
        ) : (
          <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200 text-center">
            <p className="text-slate-600 font-medium mb-3">Rəy yazmaq və ya cavab vermək üçün sistemə daxil olmalısınız.</p>
            <Link href="/login" className="inline-block bg-white border border-slate-300 text-slate-800 font-bold py-2 px-6 rounded-xl hover:bg-slate-50 transition">Daxil ol</Link>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-800 border-b border-slate-200 pb-4">Bütün Rəylər ({feedbacks.length})</h2>
          
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 font-black rounded-full flex items-center justify-center text-lg">
                    {fb.author[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      {fb.author} 
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                        {fb.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{fb.date}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  ))}
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed mb-4">{fb.text}</p>

              {isLoggedIn && (
                <button onClick={() => setReplyingToId(replyingToId === fb.id ? null : fb.id)} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg> Yanıtla
                </button>
              )}

              {replyingToId === fb.id && (
                <div className="mt-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
                  <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Cavabınızı yazın..." className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"/>
                  <button onClick={() => handleReplySubmit(fb.id)} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-700 transition">Göndər</button>
                </div>
              )}

              {fb.replies.length > 0 && (
                <div className="mt-5 space-y-3 pl-4 md:pl-10 border-l-2 border-slate-100">
                  {fb.replies.map((reply: any) => (
                    <div key={reply.id} className="p-4 rounded-xl border bg-slate-50 border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-800">{reply.author}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold bg-white border border-slate-200 text-slate-500">
                          {reply.role === 'Admin' ? 'ADMIN' : reply.role}
                        </span>
                        <span className="text-xs text-slate-400 ml-auto">{reply.date}</span>
                      </div>
                      <p className="text-sm text-slate-600">{reply.text}</p>
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