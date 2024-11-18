import { seedParkingSpots } from '../app/firebase/seedParkingSpots';

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
