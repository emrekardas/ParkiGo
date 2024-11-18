'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import debounce from 'lodash.debounce';

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
}

interface MainContentProps {
  onSearch?: (location: string, date: Date) => void;
}

const DEFAULT_COORDINATES: [number, number] = [29.0225, 41.0082]; // İstanbul koordinatları

const MainContent = ({ onSearch }: MainContentProps) => {
  const router = useRouter();
  const [destination, setDestination] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number; lng: number} | null>(null);
  const [currentLocationName, setCurrentLocationName] = useState<string>("");
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [centerCoordinates, setCenterCoordinates] = useState<[number, number]>(DEFAULT_COORDINATES);
  const parkingMapRef = useRef<{ showPopupForSpot: (spot: ParkingSpot) => void }>(null);

  const formatPlaceName = (place_name: string): string => {
    // "England" ve "United Kingdom" kelimelerini kaldır
    let formatted = place_name
      .replace(/, England/i, '')
      .replace(/, United Kingdom/i, '');
    
    return formatted;
  };

  const searchPlaces = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=5&country=gb&types=poi,place,district,locality,neighborhood,address&language=en`
        );
        const data = await response.json();
        if (data.features) {
          // Her bir önerinin place_name'ini formatla
          const formattedSuggestions = data.features.map((feature: any) => ({
            ...feature,
            formatted_place_name: formatPlaceName(feature.place_name)
          }));
          setSuggestions(formattedSuggestions);
        }
      } catch (error) {
        console.error('Error searching places:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (locationQuery) {
      searchPlaces(locationQuery);
    } else {
      setSuggestions([]);
    }
  }, [locationQuery, searchPlaces]);

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      setCurrentLocation({ lat, lng });

      // Reverse geocoding to get location name
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();
      if (data.features && data.features[0]) {
        const locationName = formatPlaceName(data.features[0].place_name);
        setCurrentLocationName(locationName);
        setLocationQuery(locationName);
        setDestination(locationName);
        setSelectedCoordinates([lng, lat]);
        
        localStorage.setItem('parkigo_location', JSON.stringify({
          coordinates: [lng, lat],
          placeName: locationName
        }));
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      alert("Unable to retrieve your location");
    }
  }, []);

  const handleSuggestionClick = (suggestion: any) => {
    const formattedName = formatPlaceName(suggestion.place_name);
    setLocationQuery(formattedName);
    setDestination(formattedName);
    const coordinates: [number, number] = [suggestion.center[0], suggestion.center[1]];
    setSelectedCoordinates(coordinates);
    setSuggestions([]);
    setIsTyping(false);
    
    localStorage.setItem('parkigo_location', JSON.stringify({
      coordinates,
      placeName: formattedName
    }));
  };

  const handleSearch = () => {
    if (selectedCoordinates && selectedDate) {
      // Önce localStorage'ı güncelle
      localStorage.setItem('parkigo_location', JSON.stringify({
        coordinates: selectedCoordinates,
        placeName: destination,
        timestamp: new Date().getTime() // Timestamp ekleyerek storage event'ını tetikle
      }));

      // Sonra yönlendirme yap
      const params = new URLSearchParams({
        lat: selectedCoordinates[1].toString(),
        lng: selectedCoordinates[0].toString(),
        location: destination,
        date: selectedDate.toISOString()
      });

      router.push(`/parking?${params.toString()}`);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');

    if (lat && lng) {
      setCenterCoordinates([parseFloat(lng), parseFloat(lat)]);
    } else {
      // localStorage'dan koordinatları al
      const savedLocation = localStorage.getItem('lastLocation');
      if (savedLocation) {
        const { coordinates, timestamp } = JSON.parse(savedLocation);
        const age = Date.now() - timestamp;
        
        // 24 saatten eski değilse kullan
        if (age < 24 * 60 * 60 * 1000) {
          setCenterCoordinates(coordinates);
        }
      }
    }
  }, []);

  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${distance}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  const handleSpotSelect = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    if (parkingMapRef.current) {
      parkingMapRef.current.showPopupForSpot(spot);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-md mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg">
          <div className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setIsTyping(true);
                    setSelectedCoordinates(null);
                  }}
                  onFocus={() => {
                    if (locationQuery && suggestions.length > 0) {
                      setIsTyping(true);
                    }
                  }}
                  placeholder="Search for a location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FCC502] focus:border-[#FCC502] outline-none"
                />
                {loading && (
                  <div className="absolute right-3 top-2.5">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FCC502]"></div>
                  </div>
                )}
                {suggestions.length > 0 && isTyping && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.formatted_place_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={getCurrentLocation}
                className="mt-2 w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Use Current Location
              </button>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="flex items-center gap-2 border border-gray-200 rounded-md hover:border-gray-300 transition-all duration-200 px-3 py-1">
                <FaCalendarAlt className="text-[#FCC502] text-base" />
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  className="w-full border-none focus:ring-0 outline-none text-gray-700 font-medium bg-transparent text-center"
                  placeholderText="Select date"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={!selectedCoordinates || !selectedDate}
              className={`w-full bg-[#FCC502] text-gray-900 font-medium py-2 px-4 rounded-lg hover:bg-[#E5B102] transition-colors duration-200 ${
                selectedCoordinates && selectedDate
                  ? ''
                  : 'cursor-not-allowed opacity-50'
              }`}
            >
              Find Parking Spot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;