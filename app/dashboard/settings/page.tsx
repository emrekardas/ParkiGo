'use client';

import { useState } from 'react';
import { FiSave, FiLock, FiMail, FiGlobe } from 'react-icons/fi';
import { MdOutlineCurrencyPound } from "react-icons/md";


export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'ParkiGo',
    siteDescription: 'Find and book parking spots easily',
    contactEmail: 'support@parkigo.com',
    currency: 'USD',
  });

  const [bookingSettings, setBookingSettings] = useState({
    minBookingDuration: 1,
    maxBookingDuration: 24,
    cancellationPeriod: 2,
    autoConfirm: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    bookingConfirmations: true,
    cancellationNotices: true,
    marketingEmails: false,
  });

  const handleSaveSettings = async () => {
    try {
      // Here you would typically save the settings to your backend
      console.log('Saving settings...');
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FiGlobe className="mr-2" />
          General Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Name</label>
            <input
              type="text"
              value={generalSettings.siteName}
              onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FCC502] focus:border-[#FCC502]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Description</label>
            <textarea
              value={generalSettings.siteDescription}
              onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FCC502] focus:border-[#FCC502]"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              value={generalSettings.contactEmail}
              onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FCC502] focus:border-[#FCC502]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              value={generalSettings.currency}
              onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FCC502] focus:border-[#FCC502]"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Booking Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <MdOutlineCurrencyPound className="mr-2" />
          Booking Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Booking Duration (hours)
            </label>
            <input
              type="number"
              value={bookingSettings.minBookingDuration}
              onChange={(e) => setBookingSettings({ ...bookingSettings, minBookingDuration: parseInt(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FCC502] focus:border-[#FCC502]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Booking Duration (hours)
            </label>
            <input
              type="number"
              value={bookingSettings.maxBookingDuration}
              onChange={(e) => setBookingSettings({ ...bookingSettings, maxBookingDuration: parseInt(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FCC502] focus:border-[#FCC502]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cancellation Period (hours)
            </label>
            <input
              type="number"
              value={bookingSettings.cancellationPeriod}
              onChange={(e) => setBookingSettings({ ...bookingSettings, cancellationPeriod: parseInt(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FCC502] focus:border-[#FCC502]"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoConfirm"
              checked={bookingSettings.autoConfirm}
              onChange={(e) => setBookingSettings({ ...bookingSettings, autoConfirm: e.target.checked })}
              className="h-4 w-4 text-[#FCC502] focus:ring-[#FCC502] border-gray-300 rounded"
            />
            <label htmlFor="autoConfirm" className="ml-2 block text-sm text-gray-700">
              Auto-confirm bookings
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FiMail className="mr-2" />
          Notification Settings
        </h2>
        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                id={key}
                checked={value}
                onChange={(e) =>
                  setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })
                }
                className="h-4 w-4 text-[#FCC502] focus:ring-[#FCC502] border-gray-300 rounded"
              />
              <label htmlFor={key} className="ml-2 block text-sm text-gray-700">
                {key.split(/(?=[A-Z])/).join(' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="flex items-center bg-[#FCC502] text-black px-4 py-2 rounded-lg hover:bg-[#FCC502]/90 transition-colors"
        >
          <FiSave className="mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
