'use client';

import { useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-2">
        <FiCheckCircle className="text-[#FCC502] h-5 w-5" />
        <p className="text-gray-800">{message}</p>
      </div>
    </div>
  );
}
