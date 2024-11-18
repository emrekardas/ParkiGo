import { seedParkingSpots } from '../app/firebase/seedParkingSpots.js';

console.log('🌱 Starting to seed database...');

// Run the seeding
seedParkingSpots()
  .then(() => {
    console.log('✅ Database seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  });
