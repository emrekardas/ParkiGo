'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCalendar, FiClock, FiMapPin, FiSettings } from 'react-icons/fi';
import { MdOutlineCurrencyPound } from "react-icons/md";
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import ReservationCard from '../components/ReservationCard';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

interface Reservation {
  id: string;
  userId: string;
  spotName: string;
  duration: string;
  price: number;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  paymentId: string;
  startTime: {
    seconds: number;
    nanoseconds: number;
  };
  endTime: {
    seconds: number;
    nanoseconds: number;
  };
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | Date;
}

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const checkReservationStatus = (reservation: Reservation) => {
    if (!reservation.endTime) {
      return reservation.status;
    }

    const now = new Date().getTime();
    const endTime = new Date(reservation.endTime.seconds * 1000);
    
    if (endTime.getTime() < now && reservation.status === 'active') {
      return 'expired';
    }
    
    return reservation.status;
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchReservations();
  }, [user, router]);

  const fetchReservations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const reservationsRef = collection(db, 'reservations');
      const q = query(
        reservationsRef,
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const reservationsData: Reservation[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const status = checkReservationStatus({
          id: doc.id,
          ...data
        } as Reservation);

        reservationsData.push({
          id: doc.id,
          ...data,
          status
        } as Reservation);
      });
      
      reservationsData.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt.seconds * 1000);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt.seconds * 1000);
        return dateB.getTime() - dateA.getTime();
      });

      setReservations(reservationsData);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">My Reservations</h1>
          <Link
            href="/my-reservations/profile"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-gray-50 text-gray-600 hover:text-black transition-all duration-200 shadow-sm"
          >
            <FiSettings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </div>

        {/* Content */}
        <div className="mt-6">
          {reservations.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">No reservations found</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#FCC502] hover:text-[#E5B102] transition-colors font-medium"
              >
                <span>Make a Reservation</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {reservations.map((reservation) => (
                <ReservationCard 
                  key={reservation.id} 
                  reservation={reservation}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ReservationCard({ reservation }: { reservation: Reservation }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'expired':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const formatDate = (date: any) => {
    if (date instanceof Date) {
      return date.toLocaleString();
    }
    return new Date(date.seconds * 1000).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
        <div className="space-y-2 sm:space-y-1 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <FiMapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <span className="font-medium text-gray-900 text-sm sm:text-base line-clamp-1">{reservation.spotName}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="w-4 h-4 flex-shrink-0 text-gray-500" />
            <span className="text-sm text-gray-500">{reservation.duration}</span>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs sm:text-sm rounded-full border ${getStatusColor(reservation.status)} whitespace-nowrap`}>
          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
        </span>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
          <FiCalendar className="w-4 h-4 flex-shrink-0" />
          <span>{formatDate(reservation.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2 font-medium text-gray-900 text-sm sm:text-base">
          <MdOutlineCurrencyPound className="w-4 h-4" />
          <span>{reservation.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
