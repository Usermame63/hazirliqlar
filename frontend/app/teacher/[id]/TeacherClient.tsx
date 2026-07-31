"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function TeacherClient({ id }: { id: string }) {
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`https://hazirliqlar-backend.onrender.com/api/teacher/${id}`);
        setTeacher(res.data);
      } catch {
        setError("Müəllim tapılmadı və ya server xətası.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  useEffect(() => {
    if (
      loading ||
      !teacher ||
      !teacher.address ||
      typeof window === "undefined"
    )
      return;

    const loadMap = async () => {
      const L = (window as any).L;
      if (!L) return;

      const [addrText, coordsText] = teacher.address
        ? teacher.address.split(" ||| ")
        : ["", ""];

      let lat = 40.4093,
        lon = 49.8671; 
      if (coordsText) {
        [lat, lon] = coordsText.split(",").map(Number);
      }

      const container = L.DomUtil.get("teacher-map");
      if (container != null) container._leaflet_id = null;

      const map = L.map("teacher-map").setView([lat, lon], 16);

      L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        attribution: "&copy; Google Maps",
      }).addTo(map);

      L.marker([lat, lon]).addTo(map);
    };

    if (!(window as any).L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = loadMap;
      document.body.appendChild(script);

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    } else {
      loadMap();
    }
  }, [loading, teacher]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error || !teacher)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {error || "Müəllim tapılmadı"}
          </h2>
          <Link
            href="/"
            className="mt-4 inline-block bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition"
          >
            Ana Səhifəyə Qayıt
          </Link>
        </div>
      </div>
    );

  const displayAddress = teacher.address
    ? teacher.address.split(" ||| ")[0]
    : "Ünvan qeyd edilməyib";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Siyahıya qayıt
        </Link>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-md text-2xl font-black">
              {teacher.user.firstName[0]}
              {teacher.user.lastName[0]}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                {teacher.user.firstName} {teacher.user.lastName}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {teacher.subjects.map((sub: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="text-right w-full md:w-auto bg-green-50 border border-green-100 p-4 rounded-xl">
            <div className="text-xs text-green-600 font-bold uppercase tracking-wider">
              Aylıq Ödəniş
            </div>
            <div className="text-3xl font-black text-green-700">
              {teacher.pricePerMonth} AZN
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">MƏLUMATLAR</h3>
            <p className="font-bold">🎓 {teacher.experience} il təcrübə</p>
            <p className="font-bold">📍 {teacher.mode}</p>
            <p className="font-bold text-sm">📞 {teacher.user.phone || "Qeyd edilməyib"}</p>
            <p className="font-bold text-sm break-all">✉️ {teacher.user.email}</p>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">TƏDRİS MƏKANI</h3>
            <p className="text-slate-700 font-semibold text-sm">📍 {displayAddress}</p>

            {teacher.address && (
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-inner">
                <div id="teacher-map" className="w-full h-80 z-0 relative"></div>
              </div>
            )}

            <Link href={`/chat?userId=${teacher.user.id}`} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-4">
              Müəllimə Mesaj Yaz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}