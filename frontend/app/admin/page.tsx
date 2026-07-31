"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>({ totalUsers: 0, totalTeachers: 0, totalStudents: 0, revenueSimulated: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aboutText, setAboutText] = useState("Biz Hazırlıqlar platforması olaraq keyfiyyətli təhsili hər kəs üçün əlçatan edirik.");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Əgər daxil olan şəxs ADMIN deyilsə, təhlükəsizlik üçün dərhal Ana səhifəyə atılır!
    if (!token || role !== "ADMIN") {
      router.push("/");
      return; 
    }
    
    const fetchAdminData = async () => {
      try {
        const statsRes = await axios.get("https://hazirliqlar-backend.onrender.com/api/admin/stats");
        setStats(statsRes.data);

        const usersRes = await axios.get("https://hazirliqlar-backend.onrender.com/api/admin/users");
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Məlumatlar yüklənmədi");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  const handleDeleteUser = async (id: string, userRole: string) => {
    // TƏHLÜKƏSİZLİK: Admin hesabının silinməsinin qəti şəkildə qarşısını alırıq!
    if (userRole === "ADMIN") {
      alert("Xəta: Admin hesabı sistemdən silinə bilməz!");
      return;
    }

    if (!confirm("Bu istifadəçini sistemdən tamamilə silmək istədiyinizə əminsiniz?")) return;
    try {
      await axios.delete(`https://hazirliqlar-backend.onrender.com/api/admin/users/${id}`);
      setUsers(users.filter((user) => (user.id || user._id) !== id));
      
      const statsRes = await axios.get("https://hazirliqlar-backend.onrender.com/api/admin/stats");
      setStats(statsRes.data);
    } catch (error) {
      alert("İstifadəçi silinə bilmədi");
    }
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Yadda saxlanılır...");
    setTimeout(() => {
      setSaveStatus("Sayt mətnləri uğurla yeniləndi! ✅");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Üst Başlıq */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              👑 İdarəetmə Paneli <span className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-bold border border-blue-500/30">ADMIN</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">Sistemi, istifadəçiləri və platforma dizaynını buradan idarə edin.</p>
          </div>
          <Link href="/" className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-md text-sm border border-slate-600">
            Ana Səhifəyə Keç
          </Link>
        </div>

        {/* Statistika */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Cəmi İstifadəçi</div>
              <div className="text-2xl font-black text-white mt-1">{stats.totalUsers}</div>
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex items-center gap-4">
            <div className="p-4 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Aktiv Müəllim</div>
              <div className="text-2xl font-black text-white mt-1">{stats.totalTeachers}</div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex items-center gap-4">
            <div className="p-4 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
            </div>
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Aktiv Şagird</div>
              <div className="text-2xl font-black text-white mt-1">{stats.totalStudents}</div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex items-center gap-4">
            <div className="p-4 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Platforma Gəliri</div>
              <div className="text-2xl font-black text-green-400 mt-1">{stats.revenueSimulated} AZN</div>
            </div>
          </div>
        </div>

        {/* İstifadəçilər və Redaktə Paneli */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sol - Cədvəl */}
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              👥 İstifadəçilərin İdarə Edilməsi
            </h3>
            <div className="overflow-x-auto flex-1 rounded-xl border border-slate-700">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-700/50 text-slate-300 text-xs font-bold uppercase border-b border-slate-700">
                    <th className="p-4">Ad Soyad</th>
                    <th className="p-4">E-poçt</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4 text-center">Əməliyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 text-sm font-medium text-slate-300">
                  {users.map((user) => (
                    <tr key={user.id || user._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 text-white font-bold">{user.firstName} {user.lastName}</td>
                      <td className="p-4 text-slate-400">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : user.role === 'TEACHER' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                          {user.role === 'ADMIN' ? 'Admin' : user.role === 'TEACHER' ? 'Müəllim' : 'Şagird'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteUser(user.id || user._id, user.role)} 
                          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded-xl border border-red-500/20 transition text-xs font-bold shadow-sm"
                        >
                          Sistemdən Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sağ - Vizual Redaktə Düyməsi */}
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center text-4xl mb-6">
              ✨
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Canlı Vizual Redaktə (UI)
            </h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed px-4">
              Mətnləri birbaşa ekran üzərindən silib-yazmaq və saytın görünüşünə canlı müdaxilə etmək üçün vizual redaktə rejiminə keçin.
            </p>
            
            <Link 
              href="/?edit=true" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all text-base tracking-wide flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              Redaktə Rejiminə Keç
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}