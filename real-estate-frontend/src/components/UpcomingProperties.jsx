import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiMapPin, FiHome, FiClock, FiX, FiMail, FiUser } from "react-icons/fi";
import skyline from '../assets/upcomingProperties/skyline.jpg';
import ocenView from '../assets/upcomingProperties/ocenView.jpg';
import greenValleyVillas from '../assets/upcomingProperties/greenValleyVilla.jpg'

const upcomingProperties = [
  {
    id: 1,
    title: "Skyline Heights",
    location: "Mumbai, Maharashtra",
    price: "Starting from ₹85 Lakh",
    image: skyline,
    status: "Launching Soon",
  },
  {
    id: 2,
    title: "Green Valley Villas",
    location: "Pune, Maharashtra",
    price: "Starting from ₹1.2 Cr",
    image: greenValleyVillas,
    status: "Coming 2026",
  },
  {
    id: 3,
    title: "Oceanview Residency",
    location: "Goa",
    price: "Starting from ₹95 Lakh",
    image: ocenView,
    status: "Pre-booking Open",
  },
];

const UpcomingProperties = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleNotifyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
    setFormData({ name: "", email: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! We'll notify you about ${selectedProperty.title}.`);
    handleCloseModal();
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Upcoming <span className="text-blue-600">Properties</span>
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Get early access to exclusive upcoming properties before they launch. Stay ahead in your dream home search!
        </p>

        {/* Property Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-56 w-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {property.status}
                </span>
              </div>
              <div className="p-5 text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <FiHome className="mr-2 text-blue-500" />
                  {property.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                  <FiMapPin className="mr-2 text-blue-500" />
                  {property.location}
                </p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
                  {property.price}
                </p>
                <button
                  onClick={() => handleNotifyClick(property)}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  <FiClock className="mr-2" />
                  Notify Me
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX className="h-6 w-6" />
              </button>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Notify Me – {selectedProperty.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Enter your details below to receive updates about this property launch.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2">
                  <FiUser className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2">
                  <FiMail className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Submit
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default UpcomingProperties;
