import { db } from '@/app/firebase/config';
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';

export interface Reservation {
  userId: string;
  spotName: string;
  duration: string;
  price: number;
  status: 'active' | 'completed' | 'cancelled';
  paymentId: string;
  createdAt?: Timestamp;
}

export const addReservation = async (reservationData: Reservation) => {
  try {
    const reservationsRef = collection(db, 'reservations');
    const docRef = await addDoc(reservationsRef, {
      ...reservationData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding reservation:', error);
    throw error;
  }
};

export const getUserReservations = async (userId: string) => {
  try {
    const reservationsRef = collection(db, 'reservations');
    const q = query(
      reservationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (Reservation & { id: string })[];
  } catch (error) {
    console.error('Error getting user reservations:', error);
    throw error;
  }
};
