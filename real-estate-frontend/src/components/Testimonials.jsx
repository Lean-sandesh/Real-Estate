import { motion } from "framer-motion";
import { FiStar, FiUser } from "react-icons/fi";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    title: "Software Engineer, Pune",
    feedback:
      "EstatePro helped me find my dream apartment within days! The agents were professional, transparent, and made the process effortless.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: 2,
    name: "Priya Mehta",
    title: "Marketing Manager, Mumbai",
    feedback:
      "I was nervous about buying my first home, but EstatePro made it easy and enjoyable. Excellent support and genuine listings!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/57.jpg",
  },
  {
    id: 3,
    name: "Amit Desai",
    title: "Entrepreneur, Goa",
    feedback:
      "Their upcoming property alerts are a game-changer. I got early access to a project that sold out in weeks. Highly recommend!",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/58.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          What Our <span className="text-blue-600">Clients Say</span>
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          We value our clients and their experiences. Here’s what some of them have to say about finding their dream homes with EstatePro.
        </p>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="flex items-center mb-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-blue-500"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.title}</p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                “{t.feedback}”
              </p>

              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`h-5 w-5 ${
                      i < t.rating
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
