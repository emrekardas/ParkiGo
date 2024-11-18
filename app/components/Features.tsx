import { FaCar, FaClock, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaCar className="w-8 h-8 text-[#FCC502]" />,
      title: "Easy Parking",
      description: "Find and reserve parking spots with just a few taps."
    },
    {
      icon: <FaClock className="w-8 h-8 text-[#FCC502]" />,
      title: "24/7 Availability",
      description: "Access parking spaces anytime, day or night."
    },
    {
      icon: <FaMobileAlt className="w-8 h-8 text-[#FCC502]" />,
      title: "Mobile First",
      description: "Manage everything from our user-friendly mobile app."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-[#FCC502]" />,
      title: "Secure Booking",
      description: "Safe and secure payment processing for all bookings."
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Parkigo?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience hassle-free parking with our innovative features designed to make your life easier.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 text-center rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
