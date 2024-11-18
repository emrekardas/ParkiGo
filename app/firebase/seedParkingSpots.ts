import { collection, addDoc } from 'firebase/firestore';
import { db } from './config.js';

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
    name: "O2 Arena Parking",
    price: 25,
    totalSpots: 100,
    availableSpots: 80,
    coordinates: {
      lat: 51.5030,
      lng: 0.0032
    },
    address: "Peninsula Square, London SE10 0DX",
    features: ["CCTV", "24/7", "Event Rates"],
    operatingHours: {
      open: "00:00",
      close: "23:59"
    },
    rating: 4.7,
    securityFeatures: ["Security Staff", "CCTV", "Barriers"],
    isIndoor: true,
    hasCharging: true,
    pricePerHour: 25
  },
  {
    name: "Hyde Park Parking",
    price: 18,
    totalSpots: 40,
    availableSpots: 15,
    coordinates: {
      lat: 51.5073,
      lng: -0.1657
    },
    address: "West Carriage Drive, London W2 2UH",
    features: ["Open Air", "Park View"],
    operatingHours: {
      open: "06:00",
      close: "00:00"
    },
    rating: 4.0,
    securityFeatures: ["CCTV", "Patrols"],
    isIndoor: false,
    hasCharging: false,
    pricePerHour: 18
  },
  {
    name: "Covent Garden Parking",
    price: 22,
    totalSpots: 25,
    availableSpots: 5,
    coordinates: {
      lat: 51.5129,
      lng: -0.1243
    },
    address: "Parker St, London WC2B 5NT",
    features: ["Central Location", "Security"],
    operatingHours: {
      open: "06:00",
      close: "01:00"
    },
    rating: 4.3,
    securityFeatures: ["CCTV", "24/7 Staff"],
    isIndoor: true,
    hasCharging: true,
    pricePerHour: 22
  }
];

export const seedParkingSpots = async () => {
  try {
    const spotsRef = collection(db, 'parkingSpots');
    
    for (const spot of parkingSpots) {
      await addDoc(spotsRef, spot);
    }
    
    console.log('Successfully seeded parking spots!');
  } catch (error) {
    console.error('Error seeding parking spots:', error);
  }
};
