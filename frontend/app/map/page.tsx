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
        const res = await axios.get("https://hazirliqlar-backend.onrender.com/api/teacher");
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

    let mapInstance: any = null;

    const loadMap = () => {
      const L = (window as any).L;
      if (!L) return;

      const container = document.getElementById('global-map');
      if (container != null) {
        (container as any)._leaflet_id = null;
        container.innerHTML = ''; 
      }

      mapInstance = L.map('global-map').setView([40.4093, 49.8671], 13);

      L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      }).addTo(mapInstance);

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

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [loading, teachers]);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      
      {/* TƏTBİQ BAŞLIĞI (Mobil format) */}
      <header className="bg-white px-5 pt-12 pb-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] z-10 relative">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Xəritədə Tap</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Sizə ən yaxın mütəxəssislər</p>
          </div>
          <Link href="/teachers" className="bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-xl text-sm active:bg-slate-200 transition">
            Siyahı
          </Link>
        </div>
      </header>

      {/* Xəritə Container (Tam Ekran) */}
      <div className="flex-1 relative z-0">
        {loading ? (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
              <div className="text-slate-500 font-bold text-sm">Xəritə yüklənir...</div>
            </div>
          </div>
        ) : (
          <>
            <div id="global-map" className="w-full h-full"></div>
            
            {/* Üzərindəki Kompakt Məlumat Qutusu (Yuxarıda, başlıq altında) */}
            <div className="absolute top-4 left-4 right-4 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-100 pointer-events-none flex justify-between items-center">
              <div className="text-sm font-bold text-slate-800">
                <span className="text-blue-600 text-base">{teachers.filter(t => t.address?.includes('|||')).length}</span> nəticə tapıldı
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Klikləyib baxın</div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}