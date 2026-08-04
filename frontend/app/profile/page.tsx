"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Profile() {
  const router = useRouter();
  
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [formData, setFormData] = useState({
    subjects: "", 
    experience: 0,
    pricePerMonth: 0,
    mode: "Əyani (Offline)",
    address: ""
  });

  // --- AYARLAR VƏ AD DƏYİŞMƏ ---
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editName, setEditName] = useState({ firstName: "", lastName: "" });
  const [nameChangeStatus, setNameChangeStatus] = useState("");

  // --- REAL ŞAGİRD MƏLUMATLARI ---
  const [recentViews, setRecentViews] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]); // YENİ ƏLAVƏ: Bəyəndiklər
  const [educationLevel, setEducationLevel] = useState("");
  const [educationInstitution, setEducationInstitution] = useState("");
  const [isEducationEditing, setIsEducationEditing] = useState(false);
  const [eduSaveStatus, setEduSaveStatus] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
    } else {
      setRole(storedRole);
      
      const firstName = localStorage.getItem("firstName") || "";
      const lastName = localStorage.getItem("lastName") || "";
      setEditName({ firstName, lastName });
      
      // Müəllim profili çəkmək
      if (storedRole === "TEACHER") {
        axios.get("https://hazirliqlar-backend.onrender.com/api/teacher/my-profile", {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          if (res.data) {
            const savedAddress = res.data.address || "";
            const [addrText, coordsText] = savedAddress.split(" ||| ");
            setFormData({
              subjects: res.data.subjects ? res.data.subjects.join(", ") : "",
              experience: res.data.experience || 0,
              pricePerMonth: res.data.pricePerMonth || 0,
              mode: res.data.mode || "Əyani (Offline)",
              address: addrText || ""
            });
            if (coordsText) {
              const [lat, lng] = coordsText.split(",");
              setCoordinates({ lat: Number(lat), lng: Number(lng) });
            }
          }
        }).catch(err => console.error("Profil çəkilə bilmədi", err));
      } 
      // Şagird məlumatlarını çəkmək
      else if (storedRole === "STUDENT") {
        // 1. Son Baxdıqlar
        axios.get("https://hazirliqlar-backend.onrender.com/api/student/recent-views", {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          setRecentViews(res.data);
        }).catch(err => console.error("Baxışlar çəkilə bilmədi", err));

        // 2. Bəyəndiklər (Favoritlər)
        axios.get("https://hazirliqlar-backend.onrender.com/api/student/favorites", {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          setFavorites(res.data);
        }).catch(err => console.error("Favoritlər çəkilə bilmədi", err));
      }
      setLoading(false);
    }
  }, [router]);

  // Ad dəyişmə
  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.firstName.trim()) return alert("Ad yazılmalıdır.");
    setNameChangeStatus("Gözləyin...");
    try {
      const token = localStorage.getItem("token");
      await axios.put("https://hazirliqlar-backend.onrender.com/api/auth/update-profile", 
        { firstName: editName.firstName, lastName: editName.lastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("firstName", editName.firstName);
      localStorage.setItem("lastName", editName.lastName);
      setNameChangeStatus("✅ Ad uğurla dəyişdirildi!");
      setTimeout(() => {
        setNameChangeStatus("");
        setSettingsOpen(false);
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      setNameChangeStatus("❌ Xəta baş verdi.");
    }
  };

  // Təhsil məlumatlarını yeniləmək
  const handleEducationSave = async () => {
    try {
      const token = localStorage.getItem("token");
      setEduSaveStatus("Gözləyin...");
      await axios.put("https://hazirliqlar-backend.onrender.com/api/student/education", 
        { educationLevel, educationInstitution },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEduSaveStatus("✅ Yeniləndi!");
      setTimeout(() => {
        setEduSaveStatus("");
        setIsEducationEditing(false);
      }, 1500);
    } catch (error) {
      console.error(error);
      setEduSaveStatus("❌ Xəta baş verdi.");
    }
  };

  // --- MÜƏLLİM SAXLAMA, GPS VƏ XƏRİTƏ ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saxlanılır...");
    try {
      const token = localStorage.getItem("token");
      const addressToSave = coordinates && formData.address 
        ? `${formData.address} ||| ${coordinates.lat},${coordinates.lng}` 
        : formData.address;
      await axios.put("https://hazirliqlar-backend.onrender.com/api/teacher/update", { ...formData, address: addressToSave }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaveStatus("Məlumatlar uğurla yeniləndi.");
      setTimeout(() => {
        setIsEditing(false);
        setSaveStatus("");
        setShowMap(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setSaveStatus("Xəta baş verdi. Yenidən yoxlayın.");
    }
  };

  const getFullAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=az`);
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        return [addr.road, addr.house_number, addr.suburb || addr.quarter, addr.city || addr.town].filter(Boolean).join(", ") || data.display_name;
      }
      return data.display_name;
    } catch (err) {
      return "Ünvan tapılmadı";
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Brauzeriniz məkan təyini dəstəkləmir.");
      return;
    }
    setSaveStatus("Məkanınız axtarılır...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const addr = await getFullAddress(latitude, longitude);
        setFormData({ ...formData, address: addr });
        setCoordinates({ lat: latitude, lng: longitude }); 
        setSaveStatus("Ünvan uğurla tapıldı.");
        setTimeout(() => setSaveStatus(""), 2000);
      },
      () => setSaveStatus("Məkan icazəsi verilmədi.")
    );
  };

  useEffect(() => {
    if (!showMap || typeof window === 'undefined') return;
    const loadMap = () => {
      const L = (window as any).L;
      if (!L) return;
      const container = L.DomUtil.get('interactive-map');
      if (container != null) container._leaflet_id = null; 
      const mapCenter = coordinates ? [coordinates.lat, coordinates.lng] : [40.4093, 49.8671];
      const map = L.map('interactive-map').setView(mapCenter as [number, number], 16); 
      L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      }).addTo(map);
      const customIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });
      let marker = L.marker(mapCenter as [number, number], { icon: customIcon }).addTo(map);
      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setSaveStatus("Peykdən ünvan oxunur...");
        const detailedAddress = await getFullAddress(lat, lng);
        setFormData(prev => ({ ...prev, address: detailedAddress }));
        setCoordinates({ lat, lng });
        setSaveStatus("Ünvan peyk xəritəsindən seçildi.");
        setTimeout(() => setSaveStatus(""), 2000);
      });
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
  }, [showMap]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 text-slate-800">
      
      {/* --- AYARLAR MODALI --- */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md mx-4 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-900">Ayarlar</h2>
              <button onClick={() => setSettingsOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center active:bg-slate-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-700 mb-2">Ad və Soyad</h3>
              <form onSubmit={handleNameChange} className="space-y-3">
                <input type="text" value={editName.firstName} onChange={(e) => setEditName({ ...editName, firstName: e.target.value })} placeholder="Ad" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" value={editName.lastName} onChange={(e) => setEditName({ ...editName, lastName: e.target.value })} placeholder="Soyad" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl active:bg-blue-700 transition text-sm shadow-md shadow-blue-500/20">Yadda Saxla</button>
                {nameChangeStatus && <div className="text-xs font-bold text-center mt-2">{nameChangeStatus}</div>}
              </form>
            </div>
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <Link href="/profile/notifications" className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl active:bg-slate-100 transition">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="text-sm font-bold text-slate-700">Bildirişlər</span>
              </Link>
              <Link href="/profile/security" className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl active:bg-slate-100 transition">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span className="text-sm font-bold text-slate-700">Təhlükəsizlik</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl active:bg-red-100 transition w-full text-left">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span className="text-sm font-bold text-red-600">Sistemdən Çıxış</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ÜST BAŞLIQ --- */}
      <header className="bg-white px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full active:scale-95 transition-transform text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">Şəxsi Kabinet</h1>
        <button onClick={() => setSettingsOpen(true)} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full active:scale-95 transition-transform text-slate-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </button>
      </header>

      <main className="px-5 pt-6 space-y-6 max-w-lg mx-auto">
        
        {/* --- PROFİL KARTI --- */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md shadow-blue-500/30 flex-shrink-0">
            {localStorage.getItem("firstName")?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">
              {localStorage.getItem("firstName") || "İstifadəçi"} {localStorage.getItem("lastName") || ""}
            </h2>
            <p className="text-sm text-slate-500 font-medium mb-1">{localStorage.getItem("email") || "mail@hazirliqlar.az"}</p>
            <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${role === 'TEACHER' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
              {role === 'TEACHER' ? 'Müəllim' : 'Şagird'}
            </span>
          </div>
        </div>

        {/* --- MÜƏLLİM ÜÇÜN --- */}
        {role === "TEACHER" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-3">Dərs Məlumatları</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                <div className="text-slate-500 text-xs font-bold mb-1">Aktiv Şagirdlər</div>
                <div className="text-xl font-black text-slate-800">0</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                <div className="text-slate-500 text-xs font-bold mb-1">Baxış Sayı</div>
                <div className="text-xl font-black text-slate-800">0</div>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <span className="font-semibold text-sm text-slate-700">Profil Detalları</span>
                </div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="text-xs bg-slate-900 text-white px-4 py-2 rounded-lg font-bold active:bg-slate-700 transition">Yenilə</button>
                )}
              </div>
              <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    <div><div className="text-[10px] text-slate-500 font-bold uppercase">Fənlər</div><div className="text-sm font-semibold text-slate-800">{formData.subjects || "Qeyd edilməyib"}</div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      <div><div className="text-[10px] text-slate-500 font-bold uppercase">Təcrübə</div><div className="text-sm font-semibold text-slate-800">{formData.experience} il</div></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <div><div className="text-[10px] text-slate-500 font-bold uppercase">Aylıq</div><div className="text-sm font-semibold text-slate-800">{formData.pricePerMonth} AZN</div></div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        )}

        {/* --- YENİ VƏ DOLĞUN ŞAGİRD PƏNCƏRƏSİ (BƏYƏNDİKLƏRİM DAXİL) --- */}
        {role === "STUDENT" && (
          <div className="space-y-6">
            
            {/* 1. STATİSTİKALAR */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-3 mb-3">Fəaliyyətim</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center text-center">
                  <div className="text-slate-500 text-[10px] font-bold mb-1">Baxdığım</div>
                  <div className="text-xl font-black text-slate-800">{recentViews.length}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center text-center">
                  <div className="text-slate-500 text-[10px] font-bold mb-1">Bəyəndiklərim</div>
                  <div className="text-xl font-black text-slate-800">{favorites.length}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center text-center">
                  <div className="text-slate-500 text-[10px] font-bold mb-1">Rəylərim</div>
                  <div className="text-xl font-black text-slate-800">0</div>
                </div>
              </div>
            </div>

            {/* 2. ŞƏXSİ MƏLUMATLAR */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-3 mb-3">Məlumatlarım</h3>
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Təhsil Səviyyəsi</p>
                      {isEducationEditing ? (
                        <input 
                          type="text" 
                          value={educationLevel}
                          onChange={(e) => setEducationLevel(e.target.value)}
                          className="text-sm font-bold text-slate-800 border-b border-slate-300 outline-none w-full bg-transparent"
                          placeholder="Məs: Lisey, Magistr"
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-800">{educationLevel || "Qeyd edilməyib"}</p>
                      )}
                    </div>
                  </div>
                  {isEducationEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEducationEditing(false)} className="text-[10px] text-slate-500 font-bold active:opacity-70">Ləğv</button>
                      <button onClick={handleEducationSave} className="text-[10px] text-blue-600 font-bold active:opacity-70">
                        {eduSaveStatus || "Saxla"}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEducationEditing(true)} className="text-[10px] text-blue-600 font-bold active:opacity-70">Dəyiş</button>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Təhsil Müəssisəsi</p>
                      {isEducationEditing ? (
                        <input 
                          type="text" 
                          value={educationInstitution}
                          onChange={(e) => setEducationInstitution(e.target.value)}
                          className="text-sm font-bold text-slate-800 border-b border-slate-300 outline-none w-full bg-transparent"
                          placeholder="Məs: Bakı Dövlət Universiteti"
                        />
                      ) : (
                        <p className="text-sm font-bold text-slate-800">{educationInstitution || "Qeyd edilməyib"}</p>
                      )}
                    </div>
                  </div>
                  {isEducationEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEducationEditing(false)} className="text-[10px] text-slate-500 font-bold active:opacity-70">Ləğv</button>
                      <button onClick={handleEducationSave} className="text-[10px] text-blue-600 font-bold active:opacity-70">
                        {eduSaveStatus || "Saxla"}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEducationEditing(true)} className="text-[10px] text-blue-600 font-bold active:opacity-70">Dəyiş</button>
                  )}
                </div>
              </div>
            </div>

            {/* YENİ: 2.5 BƏYƏNDİKLƏRİM (FAVORİTLƏR) */}
            <div>
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bəyəndiklərim</h3>
                <Link href="/teachers" className="text-[10px] text-blue-600 font-bold active:opacity-70">Daha çox</Link>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                {favorites.length > 0 ? (
                  favorites.map((fav) => (
                    <Link 
                      key={fav.id} 
                      href={`/teacher?id=${fav.teacherId}`}
                      className="min-w-[160px] bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center active:scale-95 transition-transform shadow-sm"
                    >
                      <div className="w-12 h-12 bg-red-50 text-red-600 font-bold rounded-full flex items-center justify-center mb-2 border border-red-100">
                        {fav.teacher.firstName ? fav.teacher.firstName.charAt(0).toUpperCase() : "M"}
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 truncate max-w-[120px]">
                        {fav.teacher.firstName} {fav.teacher.lastName}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {fav.teacher.subjects && fav.teacher.subjects[0] ? fav.teacher.subjects[0] : "Fənn yoxdur"}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="w-full text-center py-6 text-slate-400 text-xs">
                    Hələ heç bir müəllimi bəyənməmisiniz.
                  </div>
                )}
              </div>
            </div>

            {/* 3. SON BAXDIQLARIM */}
            <div>
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Son Baxdıqlarım</h3>
                <Link href="/teachers" className="text-[10px] text-blue-600 font-bold active:opacity-70">Hamısı</Link>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                {recentViews.length > 0 ? (
                  recentViews.map((view) => (
                    <Link 
                      key={view.id} 
                      href={`/teacher?id=${view.teacher.id}`}
                      className="min-w-[160px] bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center active:scale-95 transition-transform shadow-sm"
                    >
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 font-bold rounded-full flex items-center justify-center mb-2 border border-blue-100">
                        {view.teacher.firstName ? view.teacher.firstName.charAt(0).toUpperCase() : "M"}
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 truncate max-w-[120px]">
                        {view.teacher.firstName} {view.teacher.lastName}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {view.teacher.subjects && view.teacher.subjects[0] ? view.teacher.subjects[0] : "Fənn yoxdur"}
                      </p>
                      <span className="mt-2 text-[10px] font-bold text-green-600">{view.teacher.pricePerMonth} AZN</span>
                    </Link>
                  ))
                ) : (
                  <div className="w-full text-center py-6 text-slate-400 text-xs">
                    Hələ heç bir müəllimə baxmamısınız.
                  </div>
                )}
              </div>
            </div>

            {/* 4. TÖVSİYƏLƏR VƏ FƏAL KEÇİDLƏR */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-3 mb-3">Tövsiyələr</h3>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <h2 className="text-base font-bold text-slate-800 mb-1">Yaxınlıqda müəllim axtar!</h2>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                  Xəritəni açaraq ən yaxın məsafədəki peşəkar müəllimləri tap və baxış keçir.
                </p>
                <div className="w-full flex flex-col gap-3">
                  <Link href="/map" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl active:bg-slate-800 transition text-sm shadow-md flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                    Xəritədə Axtar
                  </Link>
                  <Link href="/teachers" className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl active:bg-slate-50 transition text-sm">
                    Bütün Siyahıya Bax
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}