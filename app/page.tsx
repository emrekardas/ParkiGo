"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import JoinUs from './components/JoinUs';
import LiveChat from './components/LiveChat';
import Toast from './components/Toast';

export default function HomePage() {
  const { user, userData, loading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if this is a new login
    const isNewLogin = sessionStorage.getItem('newLogin');
    if (isNewLogin === 'true' && user) {
      setShowWelcome(true);
      sessionStorage.removeItem('newLogin');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCC502]"></div>
          <p className="text-gray-600">Loading ParkiGo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Background */}
      <div className="relative w-full bg-gradient-to-b from-[#FCC502]/10 to-white h-16">
        <Header />
      </div>

      {/* Main Content Container - Add pt-16 for header offset */}
      <main className="flex-grow">
        {/* Main Content with Video Background */}
        <div className="w-full relative flex items-center justify-center min-h-[calc(100vh-4rem)] py-20">
          {/* Background Video */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute w-full h-full object-cover"
            >
              <source src="/background.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4">
              <MainContent />
            </div>
          </div>
        </div>

        {/* Features with Background */}
        <div className="w-full bg-gradient-to-b from-white to-gray-50">
          <Features />
        </div>

        {/* Testimonials with Background */}
        <div className="w-full bg-gradient-to-b from-gray-50 to-white">
          <Testimonials />
        </div>

        {/* Join Us Section */}
        <JoinUs />
      </main>

      {/* Footer */}
      <Footer />

      {/* Live Chat */}
      <LiveChat />

      {showWelcome && (
        <Toast
          message={`Welcome back, ${userData?.name || user?.displayName || 'User'}!`}
          onClose={() => setShowWelcome(false)}
        />
      )}
    </div>
  );
}