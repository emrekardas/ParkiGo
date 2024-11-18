'use client';

import { useState, useEffect } from 'react';
import { checkAdminUsers, makeUserAdmin, syncAuthUsersToFirestore } from '../firebase/admin-setup';

interface User {
  id: string;
  email: string;
  role?: string;
}

export default function AdminSetupPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersList = await checkAdminUsers();
      setUsers(usersList as User[]);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncMessage('Senkronizasyon başladı...');
      await syncAuthUsersToFirestore();
      setSyncMessage('Senkronizasyon başarılı!');
      await loadUsers(); // Kullanıcı listesini yenile
    } catch (error: any) {
      setSyncMessage(`Hata: ${error.message}`);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      await makeUserAdmin(userId);
      await loadUsers(); // Listeyi yenile
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="p-8">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Hata: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Kullanıcı Yönetimi</h1>
      
      <div className="mb-6">
        <button
          onClick={handleSync}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Firebase Auth Kullanıcılarını Senkronize Et
        </button>
        {syncMessage && (
          <p className="mt-2 text-sm text-gray-600">{syncMessage}</p>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium mb-4">Mevcut Kullanıcılar</h2>
          
          <div className="space-y-4">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Role: {user.role || 'Belirtilmemiş'}
                  </p>
                  <p className="text-xs text-gray-400">ID: {user.id}</p>
                </div>
                
                {user.role !== 'admin' && (
                  <button
                    onClick={() => handleMakeAdmin(user.id)}
                    className="bg-[#FCC502] text-black px-4 py-2 rounded hover:bg-[#FCC502]/90"
                  >
                    Admin Yap
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
