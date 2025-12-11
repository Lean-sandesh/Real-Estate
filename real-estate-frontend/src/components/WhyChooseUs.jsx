import { motion } from "framer-motion";
import { FaHandshake, FaHome, FaUsers, FaShieldAlt, FaHeadset, FaChartLine } from "react-icons/fa";

const benefits = [
  {
    icon: <FaHome className="text-blue-500 text-4xl mb-4" />,
    title: "Verified Properties",
    text: "All listings are verified to ensure you find trusted and genuine properties without hassle.",
  },
  {
    icon: <FaUsers className="text-blue-500 text-4xl mb-4" />,
    title: "Expert Agents",
    text: "Work with professional agents who understand your needs and guide you to the best deals.",
  },
  {
    icon: <FaHandshake className="text-blue-500 text-4xl mb-4" />,
    title: "Transparent Deals",
    text: "We ensure complete transparency with accurate property data and no hidden costs.",
  },
  {
    icon: <FaShieldAlt className="text-blue-500 text-4xl mb-4" />,
    title: "Secure & Trusted",
    text: "Your data and transactions are 100% safe through our secure real estate platform.",
  },
  {
    icon: <FaHeadset className="text-blue-500 text-4xl mb-4" />,
    title: "24/7 Support",
    text: "Our customer service team is available round-the-clock to assist you anytime, anywhere.",
  },
  {
    icon: <FaChartLine className="text-blue-500 text-4xl mb-4" />,
    title: "Market Insights",
    text: "Stay ahead with real-time data, trends, and property investment insights tailored to you.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          BENEFITS OF <span className="text-blue-600">OUR PLATFORM</span>
        </motion.h2>

        <p className="text-gray-600 dark:text-gray-400 text-lg mb-12">
          Why Choose <span className="font-semibold text-blue-600">EstatePro</span> for Your Real Estate Journey
        </p>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-center">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {benefit.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
