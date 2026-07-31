"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function TeachersList() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get("https://hazirliqlar-backend.onrender.com/api/teacher");
        setTeachers(res.data);
      } catch (error) {
        console.error("Xəta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-6 font-sans md:pt-12">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* TƏTBİQ BAŞLIĞI VƏ AXTARIŞ */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Müəllimlər</h1>
          <div className="flex items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Fənn, ad və ya məkan axtar..." className="bg-transparent w-full ml-3 outline-none text-slate-700 text-sm placeholder-slate-400" />
          </div>
        </div>

        {/* MÜƏLLİMLƏR SİYAHISI (Mobil App Formatı) */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 font-medium">Hələlik müəllim qeydiyyatdan keçməyib.</p>
            </div>
          ) : (
            teachers.map((teacher) => (
              <div key={teacher.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 active:bg-slate-50 transition-colors">
                
                {/* Profil Şəkli (Dairəvi) */}
                <div className="w-14 h-14 bg-blue-50 rounded-full flex-shrink-0 border border-slate-200 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {teacher.user?.firstName ? teacher.user.firstName.charAt(0) : "?"}
                </div>

                {/* Məlumatlar */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {teacher.user?.firstName} {teacher.user?.lastName}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium truncate">
                    {teacher.subjects && teacher.subjects[0] ? teacher.subjects[0] : "Fənn yoxdur"}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 truncate flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {teacher.mode}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {teacher.experience ? `${teacher.experience} il təcrübə` : "Təcrübə yoxdur"}
                    </span>
                  </div>
                </div>

                {/* Qiymət və Düymə */}
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-sm font-black text-slate-900">{teacher.pricePerMonth} AZN</span>
                  <Link href={`/teacher/${teacher.id}`} className="mt-2 text-xs bg-slate-900 text-white px-4 py-1.5 rounded-lg font-bold active:bg-slate-700 transition-colors">
                    Bax
                  </Link>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}