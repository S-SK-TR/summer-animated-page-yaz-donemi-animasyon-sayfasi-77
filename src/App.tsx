import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './components/ui/LoadingScreen';

// PWA bildirim izni isteği
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Bildirim izni verildi');
      }
    });
  }
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // PWA bildirim izni isteği
    requestNotificationPermission();

    // Çevrimdışı/çevrimiçi durum izleme
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <LoadingScreen isLoading={isLoading} message={isOnline ? "Yaz manzarası yükleniyor..." : "Çevrimdışı mod: Kayıtlı içerik yükleniyor"} />
      {!isLoading && (
        <div className="p-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Yaz Dönemi Animasyon Sayfası</h1>
          <p className="text-xl text-[var(--text-muted)]">Premium PWA deneyimi</p>
        </div>
      )}
    </div>
  );
}
