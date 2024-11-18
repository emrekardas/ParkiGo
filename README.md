# ParkiGo 🚗

A modern parking management system built with Next.js and Firebase, offering an intuitive solution for managing parking spaces and reservations.

![Homepage](/readmephotos/homepage-1.jpeg)

## 📱 Application Screenshots

### User Interface
| Homepage | Parking Map | My Reservations |
|----------|-------------|-----------------|
| ![Homepage](/readmephotos/homepage-2.jpeg) | ![Parking Map](/readmephotos/parkingmap.jpeg) | ![My Reservations](/readmephotos/my-reservation.jpeg) |

### Authentication & Settings
| Login | Register | Profile Settings |
|-------|----------|------------------|
| ![Login](/readmephotos/loginpage.jpeg) | ![Register](/readmephotos/registerpage.jpeg) | ![Profile Settings](/readmephotos/profile-settings.jpeg) |

### Admin Dashboard
![Admin Dashboard](/readmephotos/admin-dashboard.jpeg)

## 🌟 Features

- Real-time parking spot availability tracking
- Interactive map integration with Google Maps
- User-friendly reservation system
- Comprehensive admin dashboard
- Secure authentication system
- Profile management
- Modern and responsive UI with Tailwind CSS
- Mobile-friendly design

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js 15.0
- **UI Library:** React 19.0
- **Styling:** Tailwind CSS
- **Database:** Firebase
- **Maps:** Google Maps API
- **Testing:** Jest
- **Language:** TypeScript

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version)
- npm or yarn
- Firebase account and project setup

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/parkigo.git
   cd parkigo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🧪 Running Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

- `/app` - Next.js application routes and components
- `/public` - Static assets
- `/scripts` - Utility scripts including database seeding
- `/components` - Reusable React components
- `/readmephotos` - Project screenshots and images

## 🔑 Key Features Explained

1. **Interactive Parking Map**
   - Real-time visualization of parking spots
   - Color-coded availability status
   - Easy spot selection and booking

2. **Reservation Management**
   - Simple booking process
   - View and manage current reservations
   - Booking history

3. **Admin Dashboard**
   - Comprehensive parking spot management
   - User management
   - Analytics and reporting

4. **User Profile**
   - Personal information management
   - Reservation history
   - Account settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Emre KARDAS - [emrekardas] (https://github.com/emrekardas)

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by modern parking solutions
- Built with ❤️ using Next.js and Firebase
