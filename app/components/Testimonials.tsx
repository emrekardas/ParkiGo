import { FaStar } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular User",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      content: "Parkigo has made finding parking spots so much easier! I save time and avoid the stress of searching for parking.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      content: "As a business owner, I appreciate how Parkigo helps my customers find parking easily. It's been great for business!",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Daily Commuter",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      content: "The app is super intuitive and reliable. I use it every day for my work commute. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our users have to say about their experience with Parkigo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-[#FCC502] w-4 h-4" />
                ))}
              </div>
              <p className="text-gray-700">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
