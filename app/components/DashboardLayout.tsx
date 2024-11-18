'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiCalendar, FiUser, FiMessageSquare, FiMenu, FiX } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: { email: string };
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user: authUser } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-[#FCC502] text-black shadow-lg hover:bg-[#E5B102] transition-colors duration-200"
      >
        {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500">Welcome,</div>
              <div className="text-sm font-semibold text-gray-900 truncate">
                {authUser?.email}
              </div>
            </div>
            
            <nav className="space-y-3">
              <Link
                href="/my-reservations"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive('/my-reservations')
                    ? 'bg-[#FCC502] text-black'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiCalendar className="w-5 h-5 mr-3" />
                <span>Reservations</span>
              </Link>
              
              <Link
                href="/my-reservations/profile"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive('/my-reservations/profile')
                    ? 'bg-[#FCC502] text-black'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiUser className="w-5 h-5 mr-3" />
                <span>Profile Settings</span>
              </Link>
              
              <Link
                href="/customer-service"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive('/customer-service')
                    ? 'bg-[#FCC502] text-black'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiMessageSquare className="w-5 h-5 mr-3" />
                <span>Customer Service</span>
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>
        <div className="flex flex-col h-full">
          <Header />
          <div className="flex-1 p-4 lg:p-8 mt-16">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
