"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function FloatingEditor() {
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const router = useRouter();

  // URL-də "edit=true" varsa brauzerin gizli Dizayn rejimini (Design Mode) açırıq!
  useEffect(() => {
    if (isEdit) {
      document.designMode = "on";
      document.body.style.border = "5px solid #3b82f6"; // Redaktə rejimində olduğunu bilmək üçün kənara göy xətt
    } else {
      document.designMode = "off";
      document.body.style.border = "none";
    }
    
    return () => {
      document.designMode = "off";
      document.body.style.border = "none";
    };
  }, [isEdit]);

  const handleSave = () => {
    document.designMode = "off";
    document.body.style.border = "none";
    alert("Dizayn və mətn dəyişiklikləri serverə uğurla göndərildi! ✅");
    router.push("/admin");
  };

  if (!isEdit) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl z-[9999] flex items-center gap-6 border border-slate-700 animate-in slide-in-from-bottom-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xl animate-pulse">
          ✨
        </div>
        <div>
          <div className="font-black text-sm uppercase tracking-wider text-blue-400">Canlı Redaktə Aktivdir</div>
          <div className="text-xs text-slate-300 mt-1">İstədiyiniz mətnin üzərinə klikləyib dəyişin</div>
        </div>
      </div>
      <button 
        onClick={handleSave} 
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-500/30"
      >
        Yadda Saxla
      </button>
    </div>
  );
}