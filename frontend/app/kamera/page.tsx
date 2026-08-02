'use client';
import { useRef, useState } from 'react';

export default function KameraPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [status, setStatus] = useState('');

    const kameraAc = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
    };

    const fotografCek = async () => {
        const video = videoRef.current;
        if (!video) return;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');

        setStatus('Gönderiliyor...');
        const res = await fetch('/api/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: dataUrl }),
        });
        const data = await res.json();
        setStatus(data.ok ? 'Gönderildi!' : 'Hata: ' + data.description);
    };

    return (
        <div>
            <h1>Kamera</h1>
            <button onClick={kameraAc}>Kamerayı Aç</button>
            <video ref={videoRef} autoPlay style={{ width: '400px' }}></video>
            <button onClick={fotografCek}>Fotoğraf Çek</button>
            <p>{status}</p>
        </div>
    );
}