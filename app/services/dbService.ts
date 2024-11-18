import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

// Yeni bir belge ekleme
export async function addParkingSpot(data: any) {
    try {
        const docRef = await addDoc(collection(db, 'parkingSpots'), data);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Tüm belgeleri alma
export async function getParkingSpots() {
    const snapshot = await getDocs(collection(db, 'parkingSpots'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Belirli bir belgeyi ID ile alma
export async function getParkingSpotById(id: string) {
    const docRef = doc(db, 'parkingSpots', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }
}
