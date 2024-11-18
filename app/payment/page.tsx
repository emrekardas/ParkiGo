'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const spotName = searchParams.get('spotName');
  const price = searchParams.get('price');
  const duration = searchParams.get('duration');

  // Convert price to pence for UK currency
  const priceInPence = price ? parseFloat(price) * 100 : 0;

  useEffect(() => {
    if (!user) {
      const currentPath = `/payment?${searchParams.toString()}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || '';
    }
    // Format expiry date with slash
    else if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
    }
    // Limit CVV to 3 digits
    else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substr(0, 3);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Ödeme işlemi simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Benzersiz bir payment ID oluştur
      const paymentId = 'pay_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Confirmation sayfasına yönlendir
      router.push(
        `/payment/confirmation?` + 
        new URLSearchParams({
          spotName: spotName || '',
          price: price?.toString() || '',
          duration: duration || '',
          paymentId: paymentId
        }).toString()
      );
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCC502]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment</h1>
        
        {/* User Information */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Details</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Full Name: {user.name}</p>
            <p className="text-gray-600">Email: {user.email}</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Parking Space: {spotName}</p>
            <p className="text-gray-600">Duration: {duration}</p>
            <p className="text-gray-600">Total Amount: {formatCurrency(priceInPence, 'GBP')}</p>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FCC502] focus:ring-[#FCC502]"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FCC502] focus:ring-[#FCC502]"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FCC502] focus:ring-[#FCC502]"
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-6 w-full bg-[#FCC502] hover:bg-[#E5B102] text-black py-3 px-4 rounded-md transition-colors
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </div>
            ) : (
              'Complete Payment'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
