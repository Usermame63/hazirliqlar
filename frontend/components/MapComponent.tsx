"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Xəritənin dizayn faylı

// Xəritə ikonlarının Next.js-də düzgün görünməsi üçün tənzimləmə
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapComponent() {
  // Bakının mərkəz koordinatları
  const defaultPosition: [number, number] = [40.4093, 49.8671]; 

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 z-0 relative">
      <MapContainer center={defaultPosition} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Test üçün bir müəllim markeri */}
        <Marker position={[40.4093, 49.8671]}>
          <Popup>
            <div className="text-center font-sans">
              <strong className="text-lg">Elgün Müəllim</strong><br/>
              Riyaziyyat - 50 AZN<br/>
              <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition">Profilə bax</button>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}