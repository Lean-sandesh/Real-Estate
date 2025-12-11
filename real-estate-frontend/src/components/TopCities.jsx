import { motion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";
import mumbai from '../assets/mumbai.jpg';
import delhi from '../assets/delhi.jpg';
import bengaluru from '../assets/bangalore.jpg';
import pune from '../assets/pune.jpg';
import hyderabad from '../assets/hyderabad.jpg';
import chennai from '../assets/chennai.jpg'

const cities = [
  {
    name: "Mumbai",
    properties: "25,000+ Properties",
    image: mumbai,
  },
  {
    name: "Delhi / NCR",
    properties: "18,000+ Properties",
    image: delhi,
  },
  {
    name: "Bengaluru",
    properties: "22,500+ Properties",
    image: bengaluru,
  },
  {
    name: "Pune",
    properties: "12,000+ Properties",
    image: pune,
  },
  {
    name: "Hyderabad",
    properties: "15,400+ Properties",
    image: hyderabad,
  },
  {
    name: "Chennai",
    properties: "10,800+ Properties",
    image: chennai,
  },
];

const TopCities = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Section Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3"
        >
          TOP <span className="text-blue-600">CITIES</span>
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-400 mb-12 text-lg">
          Explore Real Estate in Popular Indian Cities
        </p>

        {/* City Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>

              {/* Overlay Text */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <h3 className="text-2xl font-semibold text-white flex items-center">
                  <FiMapPin className="mr-2 text-blue-400" /> {city.name}
                </h3>
                <p className="text-gray-200 mt-1">{city.properties}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCities;
