'use client';

import { db } from './config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// Admin kullanıcılarını kontrol eden ve listeleyen fonksiyon
export async function checkAdminUsers() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    console.log('Mevcut kullanıcılar:');
    snapshot.forEach((doc) => {
      const userData = doc.data();
      console.log(`Email: ${userData.email}`);
      console.log(`Role: ${userData.role || 'role yok'}`);
      console.log(`ID: ${doc.id}`);
      console.log('------------------------');
    });
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Kullanıcıları kontrol ederken hata:', error);
    throw error;
  }
}

// Belirli bir kullanıcıyı admin yapmak için fonksiyon
export async function makeUserAdmin(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: 'admin'
    });
    console.log(`Kullanıcı ${userId} admin yapıldı`);
  } catch (error) {
    console.error('Admin yaparken hata:', error);
    throw error;
  }
}

// Firebase Authentication'dan kullanıcıları Firestore'a ekleyen fonksiyon
export async function syncAuthUsersToFirestore() {
  try {
    const response = await fetch('/api/sync-users', {
      method: 'POST',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Senkronizasyon hatası');
    }
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Kullanıcıları senkronize ederken hata:', error);
    throw error;
  }
}
