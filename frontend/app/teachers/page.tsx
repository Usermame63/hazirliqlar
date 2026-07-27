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
        const res = await axios.get("http://localhost:5000/api/teacher");
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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Bütün <span className="text-blue-600">Müəllimlər</span>
        </h1>
        <p className="text-slate-500 text-lg">Platformamızdakı peşəkar müəllimlərlə tanış olun.</p>
      </div>

      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700">Hələlik müəllim yoxdur</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{teacher.user.firstName} {teacher.user.lastName}</h3>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full mt-2">{teacher.subjects[0] || "Fənn yoxdur"}</span>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold text-sm">{teacher.pricePerMonth} AZN</div>
                </div>
                <div className="space-y-2 text-sm text-slate-600 mb-6">
                  <p>📍 {teacher.mode}</p>
                  <p>🎓 {teacher.experience} il təcrübə</p>
                </div>
                <Link href={`/teacher/${teacher.id}`} className="block w-full text-center bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition">
                  Profilə bax
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}