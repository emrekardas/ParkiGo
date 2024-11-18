'use client';

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface ParkingSpot {
  id: string;
  name: string;
  coordinates: {
    lng: number;
    lat: number;
  };
  address: string;
  availableSpots: number;
  totalSpots: number;
  pricePerHour: number;
  distance: number;
  hasEVCharging: boolean;
  hasDisabledAccess: boolean;
  disabledSpots?: number;
}

interface ParkingMapProps {
  centerCoordinates: [number, number];
  onSpotSelect?: (spot: ParkingSpot) => void;
  onSpotsUpdate?: (spots: ParkingSpot[]) => void;
}

interface ParkingMapRef {
  showPopupForSpot: (spot: ParkingSpot) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (!MAPBOX_TOKEN) {
  throw new Error('Mapbox access token is required. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file');
}

const SEARCH_RADIUS = 500; // metre cinsinden arama yarıçapı

const ParkingMap = forwardRef<ParkingMapRef, ParkingMapProps>(({ centerCoordinates, onSpotSelect, onSpotsUpdate }, ref) => {
  const router = useRouter();
  const { user } = useAuth();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const savedLocationMarker = useRef<mapboxgl.Marker | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(centerCoordinates);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Popup'ı kapatma fonksiyonu
  const closePopup = useCallback(() => {
    if (popup.current) {
      popup.current.remove();
      popup.current = null;
    }
  }, []);

  // Popup gösterme fonksiyonu
  const showPopupForSpot = useCallback((spot: ParkingSpot) => {
    // Aynı spot için popup zaten açıksa, işlemi durdur
    if (popup.current && selectedSpot?.id === spot.id) {
      return;
    }

    // Önceki popup'ı temizle
    closePopup();

    if (map.current) {
      const newPopup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        className: 'custom-popup',
        offset: [0, -15],
        maxWidth: '320px' // Maksimum genişliği sınırla
      })
        .setLngLat([spot.coordinates.lng, spot.coordinates.lat])
        .setHTML(`
          <div class="p-4 min-w-[280px] max-w-[320px] font-sans bg-white" style="border-radius: 12px;">
            <div class="flex flex-col space-y-3">
              <!-- Header Section -->
              <div class="flex justify-between items-start gap-3">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 text-lg leading-tight truncate">${spot.name}</h3>
                  <p class="text-sm text-gray-600 mt-1 line-clamp-2">${spot.address}</p>
                </div>
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium whitespace-nowrap ${
                    spot.availableSpots <= spot.totalSpots * 0.2 ? 'bg-red-50 text-red-700 border border-red-200' :
                    spot.availableSpots <= spot.totalSpots * 0.5 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                    'bg-green-50 text-green-700 border border-green-200'
                  }">
                    ${spot.availableSpots}/${spot.totalSpots}
                  </span>
                </div>
              </div>
        
              <!-- Info Grid Section -->
              <div class="grid grid-cols-2 gap-y-3 py-3 border-y border-gray-100">
                
                <!-- Price Info -->
                <div class="flex items-center">
                  <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span class="ml-2 text-sm font-medium text-gray-900">£${spot.pricePerHour}/hour</span>
                </div>
                
                <!-- Distance Info -->
                <div class="flex items-center">
                  <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <span class="ml-2 text-sm text-gray-600">${formatDistance(spot.distance)}</span>
                </div>
              </div>
        
              <!-- Features Section -->
              ${spot.hasEVCharging || spot.hasDisabledAccess ? `
                <div class="flex flex-wrap gap-2 mt-2">
                  ${spot.hasEVCharging ? `
                    <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors">
                      <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                      EV Charging
                    </span>
                  ` : ''}
                  ${spot.hasDisabledAccess ? `
                    <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition-colors">
                      <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14a8 8 0 11-16 0 8 8 0 0116 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v4m-4-2h8"/>
                      </svg>
                      Disabled Access
                    </span>
                  ` : ''}
                </div>
              ` : ''}
        
              <!-- Action Buttons Section -->
              <div class="flex gap-2 pt-4">
                <button
                  onclick="window.handleBookNow && window.handleBookNow('${spot.id}')"
                  class="flex-1 h-10 py-2 px-4 bg-[#FCC502] hover:bg-[#E5B102] text-black rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#FCC502] focus:ring-offset-2"
                >
                  Book Now
                </button>
                <button
                  onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${spot.coordinates.lat},${spot.coordinates.lng}', '_blank')"
                  class="h-10 px-3 py-2 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `);
      // Popup kapandığında state'i temizle
      newPopup.on('close', () => {
        setSelectedSpot(null);
        popup.current = null;
      });

      // Popup'ı haritaya ekle
      newPopup.addTo(map.current);
      popup.current = newPopup;

      // State'i güncelle
      setSelectedSpot(spot);

      // Haritayı spot konumuna kaydır
      map.current.flyTo({
        center: [spot.coordinates.lng, spot.coordinates.lat],
        zoom: 15,
        essential: true,
        duration: 1000 // Animasyon süresi
      });
    }
  }, [map, closePopup, selectedSpot]);

  // Ref üzerinden metodları dışa aç
  useImperativeHandle(ref, () => ({
    showPopupForSpot
  }));

  // Marker oluşturma fonksiyonu
  const createMarker = useCallback((spot: ParkingSpot) => {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.innerHTML = `
      <div class="w-8 h-8 bg-[#FCC502] rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform border-2 border-white">
        <span class="text-sm font-semibold text-black">P</span>
      </div>
    `;

    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat([spot.coordinates.lng, spot.coordinates.lat]);

    // Marker'a tıklama olayı ekle
    el.addEventListener('click', (e) => {
      e.stopPropagation(); // Event propagation'ı durdur
      setSelectedSpot(spot);
      showPopupForSpot(spot);
      if (onSpotSelect) onSpotSelect(spot);
    });

    // Marker'ı haritaya ekle
    if (map.current) {
      marker.addTo(map.current);
    }

    return marker;
  }, [onSpotSelect, showPopupForSpot]);

  // Seçili lokasyon marker'ını güncelle
  const updateSavedLocationMarker = (coordinates: [number, number], placeName?: string) => {
    // Eski marker'ı temizle
    if (savedLocationMarker.current) {
      savedLocationMarker.current.remove();
    }

    // Özel marker elementi oluştur
    const el = document.createElement('div');
    el.className = 'saved-location-marker';
    el.innerHTML = `
      <div class="w-8 h-8 bg-[#FCC502] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
        </svg>
      </div>
    `;

    // Yeni marker oluştur
    savedLocationMarker.current = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat([coordinates[0], coordinates[1]])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold">Selected Location</h3>
              <p>${placeName || 'Custom Location'}</p>
            </div>
          `)
      );

    // Marker'ı haritaya ekle
    if (map.current) {
      savedLocationMarker.current.addTo(map.current);
    }
  };

  // Kullanıcı konumu marker'ını oluştur
  const createUserLocationMarker = (lngLat: [number, number]) => {
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Özel marker elementi oluştur
    const el = document.createElement('div');
    el.className = 'relative';
    el.innerHTML = `
      <div class="absolute w-6 h-6 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2">
        <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        <div class="absolute inset-0 bg-blue-500 rounded-full"></div>
        <div class="absolute inset-[2px] bg-white rounded-full"></div>
        <div class="absolute inset-[4px] bg-blue-500 rounded-full"></div>
      </div>
    `;

    // Marker'ı oluştur ve haritaya ekle
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'center'
    })
      .setLngLat(lngLat)
      .addTo(map.current!);

    userMarkerRef.current = marker;

    // Popup ekle
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      className: 'custom-popup'
    })
      .setHTML('<div class="text-sm font-medium">Your Location</div>');

    marker.setPopup(popup);

    // Hover efekti
    el.addEventListener('mouseenter', () => popup.addTo(map.current!));
    el.addEventListener('mouseleave', () => popup.remove());
  };

  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  const addMarkerForSpot = (spot: ParkingSpot) => {
    const marker = createMarker(spot);
    markers.current.push(marker);
  };

  const generateParkingSpotsWithinRadius = (center: [number, number]): ParkingSpot[] => {
    // Rastgele açılar ve mesafeler oluştur (0-500m arası)
    const generateRandomSpot = () => {
      const angle = Math.random() * 2 * Math.PI; // 0-2π arası rastgele açı
      const distance = Math.random() * SEARCH_RADIUS; // 0-500m arası rastgele mesafe
      
      // Polar koordinatları kartezyen koordinatlara dönüştür
      const lat = center[1] + (distance / 111111) * Math.cos(angle); // 111111 metre = 1 derece enlem
      const lng = center[0] + (distance / (111111 * Math.cos(center[1] * Math.PI / 180))) * Math.sin(angle);
      
      return { lat, lng, distance };
    };

    // 6 farklı park yeri oluştur
    return Array.from({ length: 6 }, (_, index) => {
      const spot = generateRandomSpot();
      return {
        id: (index + 1).toString(),
        name: [
          'Central Parking',
          'City Square Parking',
          'Downtown Garage',
          'Station Parking',
          'Market Parking',
          'Plaza Parking'
        ][index],
        coordinates: {
          lng: spot.lng,
          lat: spot.lat
        },
        address: [
          '123 Main Street',
          '456 Market Street',
          '789 Park Avenue',
          '321 Train Street',
          '654 Market Plaza',
          '987 Plaza Road'
        ][index],
        availableSpots: Math.floor(Math.random() * 30) + 1,
        totalSpots: Math.floor(Math.random() * 20) + 30,
        pricePerHour: Math.floor(Math.random() * 3) + 2,
        distance: Math.round(spot.distance), // Metre cinsinden tam sayı olarak mesafe
        hasEVCharging: Math.random() > 0.5,
        hasDisabledAccess: Math.random() > 0.3,
        disabledSpots: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : undefined
      };
    });
  };

  const fetchParkingSpots = async (coordinates: [number, number]): Promise<ParkingSpot[]> => {
    try {
      setIsLoading(true);
      
      // Mevcut marker'ları temizle
      clearMarkers();

      // Belirtilen yarıçap içinde park yerleri oluştur
      const parkingSpots = generateParkingSpotsWithinRadius(coordinates);

      // Her park yeri için marker oluştur
      parkingSpots.forEach(spot => {
        addMarkerForSpot(spot);
      });

      // State'i güncelle
      setParkingSpots(parkingSpots);

      if (onSpotsUpdate) {
        onSpotsUpdate(parkingSpots);
      }

      setIsLoading(false);
      return parkingSpots;

    } catch (error) {
      console.error('Error fetching parking spots:', error);
      setIsLoading(false);
      return [];
    }
  };

  const calculateBoundingBox = (lat: number, lon: number, radiusInMeters: number) => {
    const R = 6371000; // Dünya yarıçapı (metre)
    const latRadian = (lat * Math.PI) / 180;
    
    // Enlem ve boylam için delta hesapla
    const latDelta = (radiusInMeters / R) * (180 / Math.PI);
    const lonDelta = (radiusInMeters / (R * Math.cos(latRadian))) * (180 / Math.PI);
    
    return {
      north: lat + latDelta,
      south: lat - latDelta,
      east: lon + lonDelta,
      west: lon - lonDelta
    };
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Dünya'nın yarıçapı (metre cinsinden)
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return Math.round(R * c); // metre cinsinden mesafeyi tam sayıya yuvarla
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  // Harita merkezini güncelle ve park yerlerini ara
  const handleSearch = async () => {
    if (!map.current) return;
    
    const center = map.current.getCenter();
    const coordinates: [number, number] = [center.lng, center.lat];
    
    // Marker'ı haritanın yeni merkezine taşı
    updateSavedLocationMarker(coordinates, 'Current Search Location');
    
    // Park yerlerini güncelle ve sidebar'ı güncelle
    const spots = await fetchParkingSpots(coordinates);
    setParkingSpots(spots);
    if (onSpotsUpdate && spots.length > 0) {
      onSpotsUpdate(spots);
    }

    // localStorage'ı güncelle
    localStorage.setItem('parkigo_location', JSON.stringify({
      coordinates,
      placeName: 'Current Search Location',
      timestamp: new Date().getTime()
    }));

    // Search butonunu gizle
    setShowSearchButton(false);
  };

  // Kullanıcı konumunu al ve haritayı güncelle
  const updateUserLocation = useCallback(async () => {
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Kullanıcı konumunu localStorage'a kaydet
      localStorage.setItem('userLocation', JSON.stringify({ lat: latitude, lng: longitude }));
      
      // Haritayı kullanıcı konumuna merkezle
      if (map.current) {
        map.current.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          duration: 2000
        });
      }

      // Kullanıcı konumu için marker oluştur
      createUserLocationMarker([longitude, latitude]);
      
      setMapCenter([longitude, latitude]);
      setShowSearchButton(true);
    } catch (error) {
      console.error('Error getting user location:', error);
      alert('Could not get your location. Please enable location services and try again.');
    }
  }, []);

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      try {
        mapboxgl.accessToken = MAPBOX_TOKEN;
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: centerCoordinates,
          zoom: 14,
        });

        // Harita yüklendiğinde park yerlerini getir
        map.current.on('load', () => {
          fetchParkingSpots(centerCoordinates);
        });

        // Harita kontrolleri ekle
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          'top-right'
        );

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [centerCoordinates]);

  useEffect(() => {
    if (!mapInitialized || !map.current) return;

    const onMoveEnd = debounce(() => {
      setShowSearchButton(true);
    }, 300);

    const onMoveStart = () => {
      setShowSearchButton(true);
    };

    map.current.on('moveend', onMoveEnd);
    map.current.on('movestart', onMoveStart);

    return () => {
      if (map.current) {
        map.current.off('moveend', onMoveEnd);
        map.current.off('movestart', onMoveStart);
      }
    };
  }, [mapInitialized]);

  useEffect(() => {
    if (!mapInitialized || !map.current) return;

    const updateSpots = async () => {
      try {
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        const center = map.current!.getCenter();
        const spots = await fetchParkingSpots([center.lng, center.lat]);

        // Update parent component with new spots
        if (onSpotsUpdate) {
          onSpotsUpdate(spots);
        }
      } catch (error) {
        console.error('Error updating parking spots:', error);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');
    
    if (lat && lng) {
      const coordinates: [number, number] = [parseFloat(lng), parseFloat(lat)];
      map.current!.flyTo({
        center: coordinates,
        zoom: 15,
        essential: true
      });
      updateSpots();
    } else {
      const savedLocation = localStorage.getItem('parkigo_location');
      if (savedLocation) {
        try {
          const { coordinates } = JSON.parse(savedLocation);
          if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
            map.current!.flyTo({
              center: coordinates,
              zoom: 15,
              essential: true
            });
            updateSpots();
          }
        } catch (error) {
          console.error('Error parsing saved location:', error);
          updateSpots(); 
        }
      } else {
        updateUserLocation();
      }
    }
  }, [mapInitialized, onSpotSelect, onSpotsUpdate]);

  useEffect(() => {
    const handleLocationUpdate = () => {
      const savedLocation = localStorage.getItem('parkigo_location');
      if (savedLocation && map.current) {
        try {
          const { coordinates, placeName } = JSON.parse(savedLocation);
          if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
            updateSavedLocationMarker(coordinates, placeName);
          }
        } catch (error) {
          console.error('Error parsing saved location:', error);
        }
      }
    };

    window.addEventListener('storage', handleLocationUpdate);
    return () => {
      window.removeEventListener('storage', handleLocationUpdate);
    };
  }, []);

  useEffect(() => {
    return () => {
      closePopup();
    };
  }, [closePopup]);

  const handleBookNow = useCallback((spot: ParkingSpot) => {
    // Kullanıcı giriş yapmamışsa
    if (!user) {
      const currentPath = `/payment?spotName=${encodeURIComponent(spot.name)}&price=${spot.pricePerHour}&duration=1 saat`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Kullanıcı giriş yapmışsa
    const params = new URLSearchParams({
      spotName: spot.name,
      price: spot.pricePerHour.toString(),
      duration: '1 saat'
    });
    
    router.push(`/payment?${params.toString()}`);
  }, [router, user]);

  // Global window nesnesine booking fonksiyonunu ekle
  useEffect(() => {
    (window as any).handleBookNow = (spotId: string) => {
      const spot = parkingSpots.find(s => s.id === spotId);
      if (spot) {
        handleBookNow(spot);
      }
    };

    return () => {
      delete (window as any).handleBookNow;
    };
  }, [parkingSpots, handleBookNow]);

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row overflow-hidden pt-16">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className={`
          relative w-full
          ${isSidebarOpen ? 'h-[50vh]' : 'h-[calc(100vh-4rem)]'}
          md:h-full md:flex-1
          transition-all duration-300 ease-in-out
        `}
        style={{ touchAction: 'pan-x pan-y' }}
      />

      {/* Search Button - Mobile Only */}
      {showSearchButton && (
        <button
          onClick={handleSearch}
          className="md:hidden fixed left-1/2 transform -translate-x-1/2 z-20 
            bg-[#FCC502] text-black px-6 py-3 rounded-full font-semibold shadow-lg 
            hover:bg-[#E5B102] transition-colors focus:outline-none focus:ring-2 
            focus:ring-[#FCC502] focus:ring-offset-2"
          style={{
            bottom: isSidebarOpen ? 'calc(50vh + 1rem)' : '6rem'
          }}
        >
          Search this area
        </button>
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed md:relative
          w-full md:w-96
          bg-white
          transition-all duration-300 ease-in-out
          ${isSidebarOpen 
            ? 'bottom-0 h-[50vh] rounded-t-2xl shadow-[-2px_-2px_10px_rgba(0,0,0,0.1)]' 
            : 'bottom-[-100vh] h-[50vh]'
          }
          md:bottom-0 md:h-full md:shadow-none md:rounded-none md:border-l
          z-30 md:z-auto
        `}
      >
        {/* Drag Handle - Mobile Only */}
        <div 
          className="md:hidden w-full h-6 flex items-center justify-center cursor-pointer relative"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header with Close Button */}
        <div className="sticky top-0 z-50 bg-white border-b">
          <div className="p-4 relative">
            {/* Close Button - Mobile Only */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 
                text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                rounded-full transition-colors z-50"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Content */}
            <h2 className="text-lg font-semibold text-gray-900 pr-12">Available Parking Spots</h2>
            <p className="text-sm text-gray-600 mt-1">
              {parkingSpots.length} spots found within {SEARCH_RADIUS}m
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="space-y-3 p-4">
            {parkingSpots.map((spot) => {
              const availabilityPercentage = (spot.availableSpots / spot.totalSpots) * 100;
              const availabilityColor = 
                availabilityPercentage <= 20 ? 'bg-red-50 text-red-700 border-red-200' :
                availabilityPercentage <= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-green-50 text-green-700 border-green-200';

              return (
                <div
                  key={spot.id}
                  className={`
                    rounded-lg border transition-all cursor-pointer
                    active:scale-[0.98] hover:border-gray-300
                    ${selectedSpot?.id === spot.id 
                      ? 'border-[#FCC502] shadow-md' 
                      : 'border-gray-200'
                    }
                  `}
                  onClick={() => {
                    showPopupForSpot(spot);
                    onSpotSelect?.(spot);
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">
                          {spot.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{spot.address}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium ${availabilityColor}`}>
                          {spot.availableSpots}/{spot.totalSpots}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 mt-3">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">£{spot.pricePerHour}/hour</span>
                      </div>
                      <div className="flex items-center justify-end">
                        <span className="text-sm text-gray-600">{formatDistance(spot.distance)}</span>
                      </div>
                    </div>

                    {(spot.hasEVCharging || spot.hasDisabledAccess) && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {spot.hasEVCharging && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            EV Charging
                          </span>
                        )}
                        {spot.hasDisabledAccess && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                            Disabled Access
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed bottom-6 right-6 z-20 
            bg-[#FCC502] text-black p-4 rounded-full shadow-lg 
            hover:bg-[#E5B102] transition-colors focus:outline-none 
            focus:ring-2 focus:ring-[#FCC502] focus:ring-offset-2"
          aria-label="Show parking spots"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
});

export default ParkingMap;
