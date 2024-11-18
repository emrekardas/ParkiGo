'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ParkingSpot } from '@/types/parking';
import Header from '../components/Header';

// MapBox bileşenini client-side'da yükle
const ParkingMap = dynamic(() => import('../components/ParkingMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FCC502]"></div>
    </div>
  ),
});

export default function ParkingPage() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Kayıtlı lokasyonu localStorage'dan al
    const savedLocation = localStorage.getItem('parkigo_location');
    if (savedLocation) {
      try {
        const { coordinates } = JSON.parse(savedLocation);
        setMapCenter(coordinates);
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }
  }, []);

  const handleSpotsUpdate = (spots: ParkingSpot[]) => {
    setParkingSpots(spots);
  };

  // mapCenter null ise loading göster
  if (!mapCenter) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="h-screen flex flex-col">
      {/* Header Bileşeni */}
      <header className="fixed top-0 left-0 w-full z-50">
        <Header />
      </header>

      {/* Map Container */}
      <div className="flex-1 relative mt-16"> {/* 16 birim üst boşluk bırakın */}
        <ParkingMap 
          centerCoordinates={mapCenter}
          onSpotSelect={setSelectedSpot}
          onSpotsUpdate={handleSpotsUpdate}
        />
      </div>
    </main>
  );
}