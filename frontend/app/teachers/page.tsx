"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setUserRole(role);

    const fetchData = async () => {
      try {
        const teachersRes = await axios.get("https://hazirliqlar-backend.onrender.com/api/teacher");
        setTeachers(teachersRes.data);

        if (role === "STUDENT" && token) {
          const favRes = await axios.get("https://hazirliqlar-backend.onrender.com/api/student/favorites", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFavorites(favRes.data.map((f: any) => f.teacherId));
        }
      } catch (error) {
        console.error("Yükləmə xətası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFavorite = async (teacherId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || userRole !== "STUDENT") {
      alert("Favorit əlavə etmək üçün şagird kimi daxil olmalısınız.");
      return;
    }

    try {
      await axios.post("https://hazirliqlar-backend.onrender.com/api/student/favorites/toggle", 
        { teacherId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(prev => 
        prev.includes(teacherId) 
          ? prev.filter(id => id !== teacherId) 
          : [...prev, teacherId]
      );
    } catch (error) {
      console.error(error);
      alert("Xəta baş verdi!");
    }
  };

  // --- YENİ SKELETON LOADING EFFEKTİ ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl mb-10 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700 w-full"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-20 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 mb-10 shadow-sm border border-slate-200 dark:border-slate-700">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">Müəllimlər</h1>
          <p className="text-slate-500 dark:text-slate-400">Ürəyə basaraq sevimli müəllimlərinizi saxlayın!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teachers.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Hələlik müəllim qeydiyyatdan keçməyib.</p>
            </div>
          ) : (
            teachers.map((t) => (
              <div key={t.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
                {userRole === "STUDENT" && (
                  <button 
                    onClick={(e) => toggleFavorite(t.userId, e)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm shadow-sm border border-slate-100 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-600 transition-colors"
                  >
                    <svg className={`w-5 h-5 transition-colors ${favorites.includes(t.userId) ? 'text-red-500 fill-red-500' : 'text-slate-400 dark:text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  </button>
                )}

                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-700">
                  {t.user?.photoUrl ? (
                    <img src={t.user.photoUrl} alt={t.user.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-black">
                      {t.user?.firstName?.[0]?.toUpperCase() || "M"}
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-bold text-blue-700 dark:text-blue-400 shadow-sm">
                    {t.subjects && t.subjects[0]}
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{t.user?.firstName} {t.user?.lastName}</h3>
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Saatlıq ödəniş</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{t.pricePerMonth} AZN</span>
                    </div>
                    <Link href={`/teacher?id=${t.userId}`} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors dark:bg-blue-500 dark:hover:bg-blue-600">
                      Profilə Bax
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}