// components/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegBell, FaRegUser, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

export default function Header() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <header className="absolute top-0 left-0 right-0 bg-white border-b h-16 z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="ParkiGo Logo" width={120} height={40} />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  const navigationLinks = user ? (
    <>
      {userData?.role === 'admin' && (
        <Link
          href="/dashboard"
          onClick={() => setIsMenuOpen(false)}
          className="block w-full md:w-auto bg-[#FCC502] text-black px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg text-center mb-2 md:mb-0"
        >
          Dashboard
        </Link>
      )}
      <Link
        href="/my-reservations"
        onClick={() => setIsMenuOpen(false)}
        className="block w-full md:w-auto bg-[#FCC502] text-black px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg text-center mb-2 md:mb-0"
      >
        My Reservations
      </Link>
      <button
        onClick={handleLogout}
        className="block w-full md:w-auto bg-[#FCC502] text-black px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg text-center"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        onClick={() => setIsMenuOpen(false)}
        className="block w-full md:w-auto bg-[#FCC502] text-black px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg text-center mb-2 md:mb-0"
      >
        Login
      </Link>
      <Link
        href="/register"
        onClick={() => setIsMenuOpen(false)}
        className="block w-full md:w-auto bg-[#FCC502] text-black px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg text-center"
      >
        Register
      </Link>
    </>
  );

  return (
    <header className="absolute top-0 left-0 right-0 bg-white border-b h-16 z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between relative">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center">
            <Image src="/parkigo-logo.png" alt="ParkiGo Logo" width={50} height={40} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <FaTimes className="h-6 w-6" />
          ) : (
            <FaBars className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {navigationLinks}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg p-4 md:hidden flex flex-col space-y-2">
            {navigationLinks}
          </div>
        )}
      </div>
    </header>
  );
}