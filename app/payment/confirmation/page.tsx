'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { addReservation } from '@/app/services/reservationService';

const PaymentConfirmationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isProcessing = useRef(false);

  useEffect(() => {
    const saveReservation = async () => {
      if (isProcessing.current) {
        return;
      }

      if (!user) {
        console.log('No user found, redirecting to login...');
        router.push('/login');
        return;
      }

      const spotName = searchParams.get('spotName');
      const price = searchParams.get('price');
      const duration = searchParams.get('duration');
      const paymentId = searchParams.get('paymentId');

      console.log('Reservation details:', {
        userId: user.uid,
        spotName,
        price,
        duration,
        paymentId
      });

      if (!spotName || !price || !duration || !paymentId) {
        console.error('Missing reservation details:', {
          spotName,
          price,
          duration,
          paymentId
        });
        return;
      }

      try {
        isProcessing.current = true;
        console.log('Attempting to save reservation...');
        const reservationId = await addReservation({
          userId: user.uid,
          spotName,
          duration,
          price: parseFloat(price),
          status: 'active',
          paymentId
        });
        console.log('Reservation saved successfully with ID:', reservationId);
      } catch (error) {
        console.error('Error saving reservation:', error);
      } finally {
        isProcessing.current = false;
      }
    };

    saveReservation();
  }, [user, searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your reservation has been confirmed. Your parking spot is ready.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => router.push('/my-reservations')}
              className="w-full bg-[#FCC502] text-black py-3 px-4 rounded-md hover:bg-[#E5B102] transition-colors"
            >
              View My Reservations
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationPage;
