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
  
  // DƏQİQ KOORDİNATLARI yadda saxlamaq üçün əlavə etdik
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  
  const [formData, setFormData] = useState({
    subjects: "", 
    experience: 0,
    pricePerMonth: 0,
    mode: "Əyani (Offline)",
    address: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
    } else {
      setRole(storedRole);
      
      if (storedRole === "TEACHER") {
        axios.get("http://localhost:5000/api/teacher/my-profile", {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          if (res.data) {
            // Gələn məlumatdan ünvanı və gizli koordinatı ayırırıq
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
      
      // Ünvanı və Koordinatı birləşdirib gizli şəkildə göndəririk (Məs: "Bakı ||| 40.4,49.8")
      const addressToSave = coordinates && formData.address 
        ? `${formData.address} ||| ${coordinates.lat},${coordinates.lng}` 
        : formData.address;

      await axios.put("http://localhost:5000/api/teacher/update", { ...formData, address: addressToSave }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSaveStatus("Məlumatlar uğurla yeniləndi! ✅");
      setTimeout(() => {
        setIsEditing(false);
        setSaveStatus("");
        setShowMap(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setSaveStatus("Xəta baş verdi! Yenidən yoxlayın.");
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
    setSaveStatus("🌍 Məkanınız axtarılır...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const addr = await getFullAddress(latitude, longitude);
        setFormData({ ...formData, address: addr });
        setCoordinates({ lat: latitude, lng: longitude }); // Dəqiq GPS yadda saxlanır
        setSaveStatus("📍 Ünvan uğurla tapıldı!");
        setTimeout(() => setSaveStatus(""), 2000);
      },
      () => setSaveStatus("Məkan icazəsi verilmədi.")
    );
  };

  // 🗺️ PEYK (UYDU) XƏRİTƏSİ
  useEffect(() => {
    if (!showMap || typeof window === 'undefined') return;

    const loadMap = () => {
      const L = (window as any).L;
      if (!L) return;

      const container = L.DomUtil.get('interactive-map');
      if (container != null) container._leaflet_id = null; 

      // Əgər koordinat varsa onu açır, yoxsa Bakını
      const mapCenter = coordinates ? [coordinates.lat, coordinates.lng] : [40.4093, 49.8671];
      const map = L.map('interactive-map').setView(mapCenter as [number, number], 16); 

      // Google Satellite Hybrid (Peyk görüntüsü + Küçə adları)
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

        setSaveStatus("🌍 Peykdən ünvan oxunur...");
        const detailedAddress = await getFullAddress(lat, lng);
        setFormData(prev => ({ ...prev, address: detailedAddress }));
        setCoordinates({ lat, lng }); // Kliklənən yerin DƏQİQ koordinatı
        setSaveStatus("📍 Ünvan peyk xəritəsindən seçildi!");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Üst Başlıq */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Şəxsi Kabinet</h1>
              <p className="text-slate-500 font-medium">Platformadakı idarəetmə paneliniz</p>
            </div>
          </div>
          <span className={`px-5 py-2 rounded-full text-sm font-bold shadow-sm ${role === 'TEACHER' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'}`}>
            {role === 'TEACHER' ? 'Müəllim Hesabı' : 'Şagird Hesabı'}
          </span>
        </div>

        {/* --- MÜƏLLİM PƏNCƏRƏSİ --- */}
        {role === "TEACHER" && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
                <div><div className="text-slate-500 text-sm font-bold mb-1">Aktiv Şagirdlərim</div><div className="text-2xl font-black text-slate-800">0</div></div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                <div><div className="text-slate-500 text-sm font-bold mb-1">Aylıq Gəlir (Təxmini)</div><div className="text-2xl font-black text-slate-800">0 AZN</div></div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></div>
                <div><div className="text-slate-500 text-sm font-bold mb-1">Profilimə Baxış</div><div className="text-2xl font-black text-slate-800">0</div></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Məlumatların İdarəedilməsi</h2>
                  <p className="text-slate-500 text-sm mt-1">Daha çox şagird cəlb etmək üçün profilinizi tam doldurun.</p>
                </div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-md">
                    Məlumatları Yenilə
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {saveStatus && <div className="bg-green-50 text-green-700 p-4 rounded-xl font-bold text-center border border-green-200">{saveStatus}</div>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Tədris etdiyiniz fənlər</label>
                      <input type="text" value={formData.subjects} onChange={(e) => setFormData({...formData, subjects: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Məs: Riyaziyyat, Fizika" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Təcrübəniz (Neçə il?)</label>
                      <input type="number" value={formData.experience} onChange={(e) => setFormData({...formData, experience: Number(e.target.value)})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Məs: 5" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Aylıq ödəniş (AZN)</label>
                      <input type="number" value={formData.pricePerMonth} onChange={(e) => setFormData({...formData, pricePerMonth: Number(e.target.value)})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Məs: 80" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Dərs formatı</label>
                      <select value={formData.mode} onChange={(e) => setFormData({...formData, mode: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white">
                        <option>Əyani (Offline)</option>
                        <option>Onlayn (Online)</option>
                        <option>Hər ikisi</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ünvan / Lokasiya</label>
                    <div className="flex flex-col md:flex-row gap-2">
                      <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ünvanı yazın..." />
                      
                      <button type="button" onClick={handleGetLocation} className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-xl font-bold hover:bg-blue-100 transition border border-blue-200 whitespace-nowrap">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        GPS ilə tap
                      </button>

                      <button type="button" onClick={() => setShowMap(!showMap)} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition border whitespace-nowrap ${showMap ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                        🛰️ Peykdən seç
                      </button>
                    </div>

                    {showMap && (
                      <div className="mt-4 p-2 bg-white border border-slate-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4">
                        <p className="text-xs text-slate-500 mb-2 font-bold px-2 flex items-center gap-1">
                          <span>👆</span> Peyk görüntüsü üzərində dəqiq yerə toxunaraq ünvanı avtomatik təyin edin:
                        </p>
                        <div id="interactive-map" className="w-full h-80 rounded-lg z-0 relative border border-slate-100 overflow-hidden"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button type="button" onClick={() => {setIsEditing(false); setShowMap(false);}} className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
                      Ləğv et
                    </button>
                    <button type="submit" className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                      Yadda Saxla
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100"><span className="text-xl">📚</span><div><div className="text-xs text-slate-500 font-bold">Fənlər</div><div className="font-semibold text-slate-800">{formData.subjects || "Qeyd edilməyib"}</div></div></div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100"><span className="text-xl">🎓</span><div><div className="text-xs text-slate-500 font-bold">Təcrübə</div><div className="font-semibold text-slate-800">{formData.experience} il</div></div></div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100"><span className="text-xl">💰</span><div><div className="text-xs text-slate-500 font-bold">Aylıq Ödəniş</div><div className="font-semibold text-slate-800">{formData.pricePerMonth} AZN</div></div></div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100"><span className="text-xl">📍</span><div><div className="text-xs text-slate-500 font-bold">Format / Ünvan</div><div className="font-semibold text-slate-800 text-sm">{formData.mode} {formData.address ? `- ${formData.address}` : ""}</div></div></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- ŞAGİRD PƏNCƏRƏSİ --- */}
        {role === "STUDENT" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4"><div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg></div><div><div className="text-slate-500 text-sm font-bold mb-1">Dərs aldığım müəllimlər</div><div className="text-2xl font-black text-slate-800">0</div></div></div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4"><div className="p-4 bg-orange-50 text-orange-600 rounded-xl"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></div><div><div className="text-slate-500 text-sm font-bold mb-1">Yazdığım Rəylər</div><div className="text-2xl font-black text-slate-800">0</div></div></div>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100"><svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Hələ heç bir müəllim seçməmisiniz</h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">Xəritəyə və ya siyahıya baxaraq özünüzə ən yaxın və uyğun müəllimi tapın.</p>
              <Link href="/" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">Müəllim Axtar</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}