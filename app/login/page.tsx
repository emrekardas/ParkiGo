"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithEmailPassword, loginWithGoogle } from '../services/authService';
import Header from '../components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      router.push(redirect);
    }
  }, [user, router, redirect]);

  // If user is logged in, don't render the login page
  if (user) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await loginWithEmailPassword(email, password);
      sessionStorage.setItem('newLogin', 'true');
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push(redirect);
      }, 2000);
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setSuccess(null);
      await loginWithGoogle();
      sessionStorage.setItem('newLogin', 'true');
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push(redirect);
      }, 2000);
    } catch (error: any) {
      if (error.code !== 'auth/cancelled-popup-request') {
        setError(getFirebaseErrorMessage(error.code));
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header/>

      <main className="flex flex-grow items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex">
          {/* Left Column - Welcome Section */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#FCC502] to-[#e0b700] p-12 flex-col justify-between">
            <div className="text-black">
              <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
              <p className="text-lg opacity-90">Sign in to access your account and manage your parking reservations.</p>
            </div>
            <div className="text-black/80">
              <p className="text-sm">By signing in you agree to our</p>
              <div className="flex gap-2 text-sm mt-1">
                <Link href="/terms" className="underline hover:text-black">Terms of Service</Link>
                <span>&</span>
                <Link href="/privacy" className="underline hover:text-black">Privacy Policy</Link>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h3>
              <p className="text-gray-600">Welcome back to Parkigo</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FCC502]/50 focus:border-[#FCC502] transition-all"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FCC502]/50 focus:border-[#FCC502] transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#FCC502] focus:ring-[#FCC502] border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#FCC502] hover:text-[#e0b700] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#FCC502] text-black font-semibold py-3 rounded-lg hover:bg-[#e0b700] transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 text-gray-700 font-semibold border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Image src="/google.svg" alt="Google logo" width={20} height={20} />
              Google
            </button>

            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#FCC502] hover:underline font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;