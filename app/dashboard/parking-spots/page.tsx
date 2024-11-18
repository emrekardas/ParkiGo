'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiTrash2, FiEdit2, FiMapPin } from 'react-icons/fi';

interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  capacity: number;
  available: number;
  pricePerHour: number;
}

export default function ParkingSpotsPage() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParkingSpots();
  }, []);

  const fetchParkingSpots = async () => {
    try {
      const spotsSnapshot = await getDocs(collection(db, 'parkingSpots'));
      const spotsData = spotsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ParkingSpot[];
      setParkingSpots(spotsData);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSpot = async (spotId: string) => {
    if (window.confirm('Are you sure you want to delete this parking spot?')) {
      try {
        await deleteDoc(doc(db, 'parkingSpots', spotId));
        setParkingSpots(parkingSpots.filter(spot => spot.id !== spotId));
      } catch (error) {
        console.error('Error deleting parking spot:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCC502]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Parking Spots</h1>
        <button className="bg-[#FCC502] text-black px-4 py-2 rounded-lg hover:bg-[#FCC502]/90 transition-colors">
          Add New Spot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkingSpots.map((spot) => (
          <div
            key={spot.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FiMapPin className="w-6 h-6 text-[#FCC502] mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">{spot.name}</h2>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="text-[#FCC502] hover:text-[#FCC502]/80"
                    onClick={() => {/* Handle edit */}}
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteSpot(spot.id)}
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {spot.address}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium text-gray-800">{spot.capacity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium text-gray-800">{spot.available}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per hour:</span>
                  <span className="font-medium text-gray-800">
                    ${spot.pricePerHour.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${
                      spot.available > 0 ? 'bg-green-500' : 'bg-red-500'
                    } mr-2`}></div>
                    <span className="text-sm text-gray-600">
                      {spot.available > 0 ? 'Spots Available' : 'Full'}
                    </span>
                  </div>
                  <button className="text-sm text-[#FCC502] hover:text-[#FCC502]/80">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
