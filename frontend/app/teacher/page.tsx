"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

function TeacherProfileContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(decoded.userId);
    }

    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`https://hazirliqlar-backend.onrender.com/api/teacher?id=${id}`);
        setTeacher(res.data);
        setPhotoUrl(res.data.photoUrl || "");
      } catch (error) {
        console.error("Müəllim məlumatları çəkilə bilmədi:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchTeacher();
    else setLoading(false);
  }, [id]);

  const handlePhotoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl.trim()) return alert("Şəkil linkini daxil edin.");
    setSaveStatus("Gözləyin...");
    try {
      const token = localStorage.getItem("token");
      await axios.put("https://hazirliqlar-backend.onrender.com/api/teacher/photo", 
        { photoUrl }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaveStatus("✅ Yeniləndi!");
      setTimeout(() => {
        setIsEditingPhoto(false);
        setSaveStatus("");
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      setSaveStatus("❌ Xəta!");
    }
  };

  // --- Məlumatları və Koordinatları təmizləyirik ---
  let displayLat = null;
  let displayLng = null;
  let displayAddress = "Ünvan qeyd edilməyib";
  let displaySubjects = "Fənn qeyd edilməyib";
  
  if (teacher) {
    // Fənni yoxla
    if (teacher.subjects && teacher.subjects.length > 0) {
      displaySubjects = teacher.subjects.join(", ");
    }

    // Ünvanı və koordinatları yoxla
    if (teacher.address && teacher.address.includes("|||")) {
      const [addrText, coordsText] = teacher.address.split(" ||| ");
      displayAddress = addrText;
      if (coordsText) {
        const [lat, lng] = coordsText.split(",");
        displayLat = Number(lat);
        displayLng = Number(lng);
      }
    } else if (teacher.address) {
      displayAddress = teacher.address;
    }
  }

  // --- Xəritəni Yükləmək üçün UseEffect ---
  useEffect(() => {
    if (loading || !teacher || typeof window === 'undefined') return;

    if (displayLat && displayLng) {
      const loadMap = () => {
        const L = (window as any).L;
        if (!L) return;

        const container = document.getElementById('teacher-map');
        if (container != null) (container as any)._leaflet_id = null;

        const map = L.map('teacher-map').setView([displayLat, displayLng], 16);
        L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          attribution: '&copy; Google Maps'
        }).addTo(map);
        L.marker([displayLat, displayLng]).addTo(map);
      };

      if (!(window as any).L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = loadMap;
        document.body.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      } else {
        loadMap();
      }
    }
  }, [loading, teacher, displayLat, displayLng]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  if (!teacher) return <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4"><h2 className="text-xl font-bold text-slate-800 mb-2">Müəllim Tapılmadı</h2><p className="text-sm text-slate-500 mb-6">Axtardığınız profil mövcud deyil.</p><button onClick={() => router.back()} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm">Geriyə qayıt</button></div>;

  const isMyProfile = currentUserId === teacher.userId;
  const displayPhoto = teacher.user?.avatarUrl || teacher.photoUrl || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 font-sans transition-colors">
      <div className="bg-white dark:bg-slate-900 px-4 py-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10">
        <button onClick={() => router.back()} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 active:bg-slate-100 dark:active:bg-slate-700 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Müəllim Profili</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-4">
        
        {/* PROFİL KARTI */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-100 dark:border-blue-800 mb-4 bg-slate-100 flex items-center justify-center">
            {displayPhoto ? (
              <img src={displayPhoto} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-3xl font-black flex items-center justify-center">
                {teacher.user?.firstName?.[0]?.toUpperCase() || "M"}
              </div>
            )}
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">{teacher.user?.firstName} {teacher.user?.lastName}</h2>
          <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg text-xs font-bold inline-block mb-4">
            {displaySubjects}
          </div>

          {isMyProfile && !isEditingPhoto && (
            <button onClick={() => setIsEditingPhoto(true)} className="text-xs bg-slate-900 dark:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold active:bg-slate-700 transition mt-2">
              Profil Şəklini Dəyiş
            </button>
          )}

          {isMyProfile && isEditingPhoto && (
            <form onSubmit={handlePhotoUpdate} className="w-full max-w-xs mt-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <input type="text" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Şəkil linkini daxil edin..." className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 mb-2" />
              <div className="flex gap-2">
                <button type="button" onClick={() => { setIsEditingPhoto(false); setPhotoUrl(teacher.photoUrl || ""); }} className="w-1/2 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 rounded-lg">Ləğv</button>
                <button type="submit" className="w-1/2 py-1.5 text-xs font-bold text-white bg-blue-600 dark:bg-blue-500 rounded-lg">
                  {saveStatus || "Yadda Saxla"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* STATİSTİKALAR */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Təcrübə</span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-200">{teacher.experience || 0} il</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center border-l border-slate-50 dark:border-slate-800">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Aylıq Ödəniş</span>
            <span className="text-lg font-black text-green-600 dark:text-green-400">{teacher.pricePerMonth || 0} AZN</span>
          </div>
        </div>

        {/* ƏLAQƏ MƏLUMATLARI */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 space-y-2">
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-green-500 shadow-sm flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Telefon</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{teacher.user?.phone || "Qeyd edilməyib"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">E-poçt</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{teacher.user?.email || "Qeyd edilməyib"}</p>
            </div>
          </div>
        </div>

        {/* DETALLI MƏLUMATLAR */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-2 space-y-1">
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <div className="min-w-0"><p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Dərs Formatı</p><p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{teacher.mode || "Qeyd edilməyib"}</p></div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-red-500 shadow-sm flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <div className="min-w-0"><p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Ünvan</p><p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{displayAddress}</p></div>
          </div>
        </div>

        {/* PEYK XƏRİTƏSİ */}
        {displayLat && displayLng && (
          <div className="border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-inner">
            <div id="teacher-map" className="w-full h-80 z-0 relative"></div>
          </div>
        )}

        <div className="pt-2">
          <Link href={`/chat?id=${teacher.user?.id || ''}`} className="flex items-center justify-center gap-2 w-full bg-slate-900 dark:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md active:bg-slate-800 dark:active:bg-slate-700 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            Mesaj Yaz
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TeacherProfileView() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
      <TeacherProfileContent />
    </Suspense>
  )
}