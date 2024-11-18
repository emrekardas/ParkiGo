'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiHome, 
  FiUsers, 
  FiMap, 
  FiSettings, 
  FiLogOut, 
  FiArrowLeft, 
  FiMenu, 
  FiX 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAdmin, logout } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (!isAdmin) {
      router.push('/auth/login');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

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
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">ParkiGo Admin</h2>
          </div>
          
          <nav className="flex-1 px-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    router.push('/');
                    closeSidebar();
                  }}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5 mr-3" />
                  <span>Back to ParkiGo</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    router.push('/dashboard');
                    closeSidebar();
                  }}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiHome className="w-5 h-5 mr-3" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    router.push('/dashboard/users');
                    closeSidebar();
                  }}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiUsers className="w-5 h-5 mr-3" />
                  <span>Users</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    router.push('/dashboard/parking-spots');
                    closeSidebar();
                  }}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiMap className="w-5 h-5 mr-3" />
                  <span>Parking Spots</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    router.push('/dashboard/settings');
                    closeSidebar();
                  }}
                  className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiSettings className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <button
              onClick={() => {
                handleLogout();
                closeSidebar();
              }}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
