import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Sample parking spot data for London
const parkingSpots = [
  {
    name: "Westfield London Parking",
    price: 15,
    totalSpots: 50,
    availableSpots: 35,
    coordinates: {
      lat: 51.5074,
      lng: -0.2215
    },
    address: "Ariel Way, London W12 7GF",
    features: ["CCTV", "24/7", "Disabled Access"],
    operatingHours: {
      open: "00:00",
      close: "23:59"
    },
    rating: 4.5,
    securityFeatures: ["Security Staff", "CCTV", "Lighting"],
    isIndoor: true,
    hasCharging: true,
    pricePerHour: 15
  },
  {
    name: "British Museum Parking",
    price: 20,
    totalSpots: 30,
    availableSpots: 12,
    coordinates: {
      lat: 51.5194,
      lng: -0.1269
    },
    address: "Great Russell St, London WC1B 3DG",
    features: ["CCTV", "Covered", "Security"],
    operatingHours: {
      open: "08:00",
      close: "22:00"
    },
    rating: 4.2,
    securityFeatures: ["CCTV", "Lighting"],
    isIndoor: true,
    hasCharging: false,
    pricePerHour: 20
  },
  {
    name: "Covent Garden Parking",
    price: 25,
    totalSpots: 40,
    availableSpots: 8,
    coordinates: {
      lat: 51.5129,
      lng: -0.1243
    },
    address: "Parker St, London WC2B 5NT",
    features: ["CCTV", "24/7", "Valet"],
    operatingHours: {
      open: "00:00",
      close: "23:59"
    },
    rating: 4.7,
    securityFeatures: ["24/7 Security", "CCTV", "Lighting"],
    isIndoor: true,
    hasCharging: true,
    pricePerHour: 25
  },
  {
    name: "O2 Arena Parking",
    price: 18,
    totalSpots: 100,
    availableSpots: 45,
    coordinates: {
      lat: 51.5030,
      lng: 0.0032
    },
    address: "Peninsula Square, London SE10 0DX",
    features: ["CCTV", "Event Parking", "Wide Spaces"],
    operatingHours: {
      open: "06:00",
      close: "01:00"
    },
    rating: 4.3,
    securityFeatures: ["Security Patrols", "CCTV"],
    isIndoor: false,
    hasCharging: true,
    pricePerHour: 18
  },
  {
    name: "Paddington Station Parking",
    price: 22,
    totalSpots: 60,
    availableSpots: 15,
    coordinates: {
      lat: 51.5154,
      lng: -0.1755
    },
    address: "Praed St, London W2 1RH",
    features: ["CCTV", "Station Access", "Short Stay"],
    operatingHours: {
      open: "04:30",
      close: "01:30"
    },
    rating: 4.0,
    securityFeatures: ["CCTV", "Barrier Entry"],
    isIndoor: true,
    hasCharging: true,
    pricePerHour: 22
  }
];

const seedParkingSpots = async () => {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('Adding parking spots...');
    const spotsRef = collection(db, 'parkingSpots');
    
    for (const spot of parkingSpots) {
      await addDoc(spotsRef, spot);
      console.log(`Added spot: ${spot.name}`);
    }
    
    console.log('Successfully seeded all parking spots!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding parking spots:', error);
    process.exit(1);
  }
};

// Run the seeding
seedParkingSpots();
