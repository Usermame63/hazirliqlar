"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function GlobalMap() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Bütün müəllimləri bazadan çəkirik
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/teacher");
        setTeachers(res.data);
      } catch (error) {
        console.error("Müəllimləri yükləyərkən xəta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // 2. Xəritəni qururuq və müəllimləri üzərinə düzürük
  useEffect(() => {
    if (loading || typeof window === 'undefined') return;

    let mapInstance: any = null; // Çoxalmanın qarşısını almaq üçün xəritəni yadda saxlayırıq

    const loadMap = () => {
      const L = (window as any).L;
      if (!L) return;

      const container = document.getElementById('global-map');
      if (container != null) {
        // ƏSAS HƏLL BURADADIR: Köhnə xəritənin qalıqlarını tamamilə silirik
        container._leaflet_id = null; 
        container.innerHTML = ''; 
      }

      mapInstance = L.map('global-map').setView([40.4093, 49.8671], 13);

      // Premium Google Satellite Hybrid xəritəsi
      L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      }).addTo(mapInstance);

      // Hər bir müəllim üçün KOMPAKT marker yaradırıq
      teachers.forEach((teacher) => {
        if (teacher.address && teacher.address.includes("|||")) {
          const coordsText = teacher.address.split(" ||| ")[1];
          if (coordsText) {
            const [lat, lng] = coordsText.split(",").map(Number);
            
            const customIcon = L.divIcon({
              className: 'custom-avatar-marker',
              html: `
                <div style="transform: translate(-50%, -100%); position: absolute; margin-top: -5px; cursor: pointer; transition: transform 0.2s;">
                  <div style="width: 44px; height: 44px; background: white; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.4); border: 3px solid #2563eb; display: flex; align-items: center; justify-content: center; color: #2563eb; font-weight: 900; font-size: 16px;">
                    ${teacher.user?.firstName?.[0] || ""}${teacher.user?.lastName?.[0] || ""}
                  </div>
                  <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #2563eb;"></div>
                </div>
              `,
              iconSize: [0, 0],
              iconAnchor: [0, 0]
            });

            const popupContent = `
              <div style="text-align: center; font-family: sans-serif; min-width: 180px; padding: 6px;">
                <h3 style="font-weight: 900; font-size: 17px; margin: 0 0 4px 0; color: #0f172a;">
                  ${teacher.user?.firstName || ""} ${teacher.user?.lastName || ""}
                </h3>
                <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: bold; text-transform: uppercase;">
                  ${teacher.subjects?.[0] || "Fənn qeyd edilməyib"}
                </p>
                <div style="margin: 12px 0; font-weight: 900; color: #15803d; font-size: 18px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 6px; border-radius: 8px;">
                  ${teacher.pricePerMonth} AZN
                </div>
                <a href="/teacher/${teacher.id}" style="display: block; background: #2563eb; color: white; padding: 10px 12px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; transition: background 0.2s;">
                  Profilinə keçid et
                </a>
              </div>
            `;

            L.marker([lat, lng], { icon: customIcon })
              .addTo(mapInstance)
              .bindPopup(popupContent, {
                offset: [0, -35],
                closeButton: false,
                className: 'custom-popup'
              });
          }
        }
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

    // İKİNCİ HƏLL: Səhifədən çıxanda və ya yenilənəndə xəritə tam məhv edilir
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [loading, teachers]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Üst Başlıq Hissəsi */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <span className="text-4xl">🗺️</span> Xəritədə Müəllimlər
            </h1>
            <p className="text-slate-500 font-medium mt-1">Özünüzə ən yaxın müəllimi tapın və detallarına baxın.</p>
          </div>
          
          <Link href="/" className="bg-slate-100 text-slate-700 font-bold py-2.5 px-6 rounded-xl hover:bg-slate-200 transition flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            Siyahı görünüşü
          </Link>
        </div>
      </div>

      {/* Xəritənin Özü */}
      <div className="flex-grow relative p-4 md:p-8 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="w-full h-[75vh] bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
              <div className="text-slate-500 font-bold">Xəritə yüklənir...</div>
            </div>
          </div>
        ) : (
          <div className="w-full h-[75vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative z-0">
            <div id="global-map" className="w-full h-full"></div>
            
            {/* Üzərindəki Kiçik Məlumat Qutusu */}
            <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 pointer-events-none">
              <div className="text-sm font-bold text-slate-800">
                Aktiv nəticə: <span className="text-blue-600 text-lg">{teachers.filter(t => t.address?.includes('|||')).length} müəllim</span> xəritədə
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">Markerin üzərinə klikləyərək məlumatlara baxa bilərsiniz.</div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}