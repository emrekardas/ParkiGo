'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, db } from '../firebase/config';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { FiUsers, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { HiCurrencyPound } from "react-icons/hi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Stats {
  totalUsers: number;
  totalReservations: number;
  totalRevenue: number;
  monthlyReservations: { [key: string]: number };
  monthlyRevenue: { [key: string]: number };
  parkingSpotUsage: { [key: string]: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalReservations: 0,
    totalRevenue: 0,
    monthlyReservations: {},
    monthlyRevenue: {},
    parkingSpotUsage: {}
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
    fetchStats();
  }, []);

  const checkAdminAccess = async () => {
    const user = auth.currentUser;
    if (!user) {
      router.push('/loginPage');
      return;
    }

    const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', user.email)));
    if (userDoc.empty || userDoc.docs[0].data().role !== 'admin') {
      router.push('/');
    }
  };

  const fetchStats = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
      
      let totalRevenue = 0;
      const monthlyReservations: { [key: string]: number } = {};
      const monthlyRevenue: { [key: string]: number } = {};
      const parkingSpotUsage: { [key: string]: number } = {};

      reservationsSnapshot.forEach(doc => {
        const reservation = doc.data();
        const date = new Date(reservation.startTime);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        // Monthly reservations
        monthlyReservations[monthYear] = (monthlyReservations[monthYear] || 0) + 1;
        
        // Monthly revenue
        const price = reservation.price || 0;
        totalRevenue += price;
        monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + price;
        
        // Parking spot usage
        const spotId = reservation.parkingSpotId;
        parkingSpotUsage[spotId] = (parkingSpotUsage[spotId] || 0) + 1;
      });

      setStats({
        totalUsers: usersSnapshot.size,
        totalReservations: reservationsSnapshot.size,
        totalRevenue,
        monthlyReservations,
        monthlyRevenue,
        parkingSpotUsage
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthlyReservationsData = {
    labels: Object.keys(stats.monthlyReservations),
    datasets: [
      {
        label: 'Monthly Reservations',
        data: Object.values(stats.monthlyReservations),
        borderColor: '#FCC502',
        backgroundColor: 'rgba(252, 197, 2, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const monthlyRevenueData = {
    labels: Object.keys(stats.monthlyRevenue),
    datasets: [
      {
        label: 'Monthly Revenue (£)',
        data: Object.values(stats.monthlyRevenue),
        backgroundColor: '#FCC502',
      },
    ],
  };

  const parkingSpotUsageData = {
    labels: Object.keys(stats.parkingSpotUsage),
    datasets: [
      {
        data: Object.values(stats.parkingSpotUsage),
        backgroundColor: [
          '#FCC502',
          '#FFD700',
          '#FFE55C',
          '#FFF0B3',
          '#FFFAE6',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCC502]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#FCC502] hover:text-black transition-colors">
            ParkiGo
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FiUsers className="w-8 h-8 text-[#FCC502]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FiCalendar className="w-8 h-8 text-[#FCC502]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Reservations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalReservations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <HiCurrencyPound className="w-8 h-8 text-[#FCC502]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">£{stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Reservations Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservation Trends</h3>
            <Line data={monthlyReservationsData} options={chartOptions} />
          </div>

          {/* Monthly Revenue Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analysis</h3>
            <Bar data={monthlyRevenueData} options={chartOptions} />
          </div>
        </div>

        {/* Parking Spot Usage Doughnut Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Parking Spot Usage Distribution</h3>
          <div className="max-w-md mx-auto">
            <Doughnut 
              data={parkingSpotUsageData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    position: 'right' as const,
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
