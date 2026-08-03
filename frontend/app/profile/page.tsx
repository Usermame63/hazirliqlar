"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Profile() {
  const router = useRouter();
  
  // -- SƏNİN KÖHNƏ MƏNTİQ STATE-LƏRİN --
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

  // -- YENİ DİZAYN ÜÇÜN STATE-LƏR --
  const [userName, setUserName] = useState("İstifadəçi");
  const [userEmail, setUserEmail] = useState("");

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
      
      // Şəxsi məlumatları çəkirik
      const firstName = localStorage.getItem("firstName") || "";
      const lastName = localStorage.getItem("lastName") || "";
      const email = localStorage.getItem("email") || "mail@hazirliqlar.az";
      
      if (firstName) setUserName(`${firstName} ${lastName}`);
      setUserEmail(email);
      
      // Müəllim məlumatlarını backend-dən çəkirik
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
      setLoading(false);
    }
  }, [router]);

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
      
      {/* iOS STİLİ ÜST BAŞLIQ */}
      <header className="bg-white px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full active:scale-95 transition-transform text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-lg font-bold text-slate-900">Şəxsi Kabinet</h1>
        <div className="w-10 h-10 flex items-center justify-center">
           <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </div>
      </header>

      <main className="px-5 pt-6 space-y-6 max-w-lg mx-auto">
        
        {/* YENİ QRADİENT PROFİL KARTI */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md shadow-blue-500/30 flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">{userName}</h2>
            <p className="text-sm text-slate-500 font-medium mb-1">{userEmail}</p>
            <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${role === 'TEACHER' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
              {role === 'TEACHER' ? 'Müəllim' : 'Şagird'}
            </span>
          </div>
        </div>

        {/* --- MÜƏLLİM PƏNCƏRƏSİ (SƏNİN KODUN) --- */}
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
                  <button onClick={() => setIsEditing(true)} className="text-xs bg-slate-900 text-white px-4 py-2 rounded-lg font-bold active:bg-slate-700 transition">
                    Yenilə
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="p-4 space-y-4 bg-slate-50/50">
                  {saveStatus && (
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-xs font-bold text-center border border-blue-100">
                      {saveStatus}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Tədris etdiyiniz fənlər</label>
                      <input type="text" value={formData.subjects} onChange={(e) => setFormData({...formData, subjects: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Məs: Riyaziyyat, Fizika" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Təcrübə (İl)</label>
                        <input type="number" value={formData.experience} onChange={(e) => setFormData({...formData, experience: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Qiymət (AZN)</label>
                        <input type="number" value={formData.pricePerMonth} onChange={(e) => setFormData({...formData, pricePerMonth: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Dərs formatı</label>
                      <select value={formData.mode} onChange={(e) => setFormData({...formData, mode: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                        <option>Əyani (Offline)</option>
                        <option>Onlayn (Online)</option>
                        <option>Hər ikisi</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Ünvan / Lokasiya (Məkanınız)</label>
                    <div className="flex flex-col gap-2">
                      <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ünvanı yazın..." />
                      
                      <div className="flex gap-2">
                        <button type="button" onClick={handleGetLocation} className="flex-1 flex items-center justify-center gap-1.5 bg-white text-slate-700 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold active:bg-slate-100 transition shadow-sm">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          GPS ilə tap
                        </button>

                        <button type="button" onClick={() => setShowMap(!showMap)} className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition border shadow-sm ${showMap ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-200 active:bg-slate-100'}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                          Xəritədən seç
                        </button>
                      </div>
                    </div>

                    {showMap && (
                      <div className="mt-3 p-2 bg-white border border-slate-200 rounded-xl shadow-inner">
                        <p className="text-[10px] text-slate-500 mb-2 font-bold px-1 text-center">
                          Peyk görüntüsü üzərində dəqiq yerə toxunaraq ünvanı təyin edin:
                        </p>
                        <div id="interactive-map" className="w-full h-48 rounded-lg z-0 relative border border-slate-200 overflow-hidden"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-200 mt-4">
                    <button type="button" onClick={() => {setIsEditing(false); setShowMap(false);}} className="w-1/3 py-3 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 active:bg-slate-50 transition shadow-sm">
                      Ləğv et
                    </button>
                    <button type="submit" className="w-2/3 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 active:bg-blue-700 transition shadow-md shadow-blue-500/20">
                      Yadda Saxla
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    <div><div className="text-[10px] text-slate-500 font-bold uppercase">Fənlər</div><div className="text-sm font-semibold text-slate-800">{formData.subjects || "Qeyd edilməyib"}</div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      <div><div className="text-[10px] text-slate-500 font-bold uppercase">Təcrübə</div><div className="text-sm font-semibold text-slate-800">{formData.experience} il</div></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <div><div className="text-[10px] text-slate-500 font-bold uppercase">Aylıq</div><div className="text-sm font-semibold text-slate-800">{formData.pricePerMonth} AZN</div></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <div className="min-w-0"><div className="text-[10px] text-slate-500 font-bold uppercase">Format / Ünvan</div><div className="text-sm font-semibold text-slate-800 truncate">{formData.mode} {formData.address ? `- ${formData.address}` : ""}</div></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- ŞAGİRD PƏNCƏRƏSİ (SƏNİN KODUN) --- */}
        {role === "STUDENT" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-3">Fəaliyyətim</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                <div className="text-slate-500 text-xs font-bold mb-1">Müəllimlərim</div>
                <div className="text-xl font-black text-slate-800">0</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                <div className="text-slate-500 text-xs font-bold mb-1">Rəylərim</div>
                <div className="text-xl font-black text-slate-800">0</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <h2 className="text-base font-bold text-slate-800 mb-1">Müəllim seçilməyib</h2>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">Xəritəyə və ya siyahıya baxaraq özünüzə uyğun müəllimi tapın.</p>
              <Link href="/" className="w-full block bg-blue-600 text-white font-bold py-3 rounded-xl active:bg-blue-700 transition text-sm shadow-md shadow-blue-500/20">
                Axtarışa Başla
              </Link>
            </div>
          </div>
        )}

        {/* --- YENİ İOS STİLİ AYARLAR MENYUSU (TƏNZİMLƏMƏLƏR VƏ ÇIXIŞ) --- */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-3">Tənzimləmələr və Sistem</h3>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            
            {/* Bildirişlər */}
            <Link href="/profile/notifications" className="flex items-center justify-between p-4 bg-white active:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <span className="font-semibold text-sm text-slate-700">Bildirişlər</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </Link>

            {/* Təhlükəsizlik */}
            <Link href="/profile/security" className="flex items-center justify-between p-4 bg-white active:bg-slate-50 transition-colors border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <span className="font-semibold text-sm text-slate-700">Təhlükəsizlik və Şifrə</span>
              </div>
              <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>

            {/* Çıxış */}
            <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 bg-white active:bg-red-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </div>
                <span className="font-bold text-sm text-red-600">Sistemdən Çıxış</span>
              </div>
            </button>

          </div>
        </div>

      </main>
    </div>
  );
}