'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/app/firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';
import { FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';
import DashboardLayout from '@/app/components/DashboardLayout';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchUserProfile();
  }, [user, router]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      await updateDoc(doc(db, 'users', user.uid), {
        name: profile.name,
        phone: profile.phone,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      // Kullanıcının tüm rezervasyonlarını sil
      const userReservationsQuery = query(collection(db, 'reservations'), where('userId', '==', user.uid));
      const reservationSnapshot = await getDocs(userReservationsQuery);
      
      const deletePromises = reservationSnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      });
      
      await Promise.all(deletePromises);
      
      // Firebase Authentication'dan kullanıcıyı sil
      await deleteUser(user);
      
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCC502]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#FCC502] to-[#e0b700] rounded-2xl p-6 shadow-lg mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Profile Settings</h1>
          <p className="text-black/80 mt-2 text-sm sm:text-base">Manage your personal information and account settings</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl mb-6">
          <div className="p-4 sm:p-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiUser className="w-4 h-4 mr-2 text-[#FCC502]" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-2.5 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FCC502] focus:border-[#FCC502] transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiMail className="w-4 h-4 mr-2 text-[#FCC502]" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full p-2.5 sm:p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600"
                />
                <p className="text-xs sm:text-sm text-gray-500">Email cannot be changed</p>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiPhone className="w-4 h-4 mr-2 text-[#FCC502]" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full p-2.5 sm:p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FCC502] focus:border-[#FCC502] transition-all duration-200"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 sm:mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#FCC502] text-black font-medium rounded-lg hover:bg-[#e0b700] focus:outline-none focus:ring-2 focus:ring-[#FCC502] focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-l-4 border-red-500 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <FiTrash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Delete Account</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Permanently remove your account and all associated data</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center space-x-2"
              >
                <FiTrash2 className="w-5 h-5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all duration-300">
              <div className="flex items-center space-x-3 text-red-600 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <FiAlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Delete Account</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  Are you sure you want to delete your account? This action cannot be undone and will result in:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 bg-red-50 p-4 rounded-lg">
                  <li>Permanent deletion of your profile information</li>
                  <li>Loss of all your parking reservations</li>
                  <li>Removal of payment history and saved payment methods</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <FiTrash2 className="w-5 h-5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
