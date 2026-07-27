"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Xəritə mərkəzini dinamik dəyişmək üçün köməkçi komponent
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14);
  }, [center, map]);
  return null;
}

export default function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number]>([40.4093, 49.8671]); // Default: Bakı

  // Xəritəyə klikləyəndə markerin yerini dəyişmək
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  // Avtomatik məkan tapmaq
  const handleAutoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          onLocationSelect(newPos[0], newPos[1]);
        },
        (err) => {
          alert("Məkan tapılmadı. Zəhmət olmasa, xəritədə klikləyərək yerinizi seçin.");
        }
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <button 
        type="button" 
        onClick={handleAutoLocation}
        className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
      >
        📍 Məkanımı Avtomatik Tap (İcazə Ver)
      </button>
      
      <div className="h-[300px] w-full rounded-lg overflow-hidden border-2 border-slate-200 relative z-0">
        <MapContainer center={position} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapUpdater center={position} />
          <MapEvents />
          <Marker position={position} />
        </MapContainer>
      </div>
      <p className="text-xs text-slate-500 text-center">Markerin yerini dəyişmək üçün xəritədə fərqli yerə toxunun.</p>
    </div>
  );
}