import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const offices = [
    {
      title: 'Pune Office',
      addressLines: [
        '1st, Floor Office no. 101',
        'Trident Business Center, Pune Bangalore Highway',
        'Opposite Audi Showroom, Baner, Pune',
        'Maharashtra 411045'
      ],
      mapSrc:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30261.45758691432!2d73.760122!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2beb7e7c3d3b5%3A0x1b2b3b4d5e6f7a8b!2sTrident%20Business%20Center%2C%20Pune%20Bangalore%20Highway%2C%20Baner%2C%20Pune%2C%20Maharashtra%20411045!5e0!3m2!1sen!2sin!4v1630000000000!5m2!1sen!2sin'
    },
    {
      title: 'Navi Mumbai Office',
      addressLines: [
        '10th Floor, GREENSCAPE SHAKTI',
        'Sector 15, CBD Belapur',
        'Navi Mumbai',
        'Maharashtra 400614'
      ],
      mapSrc:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.314852804604!2d73.03304521502075!3d19.02282425799065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3e9a7e7a8b5%3A0x1b2b3b4d5e6f7a8b!2sGreenscape%20Shakti%2C%20Sector%2015%2C%20CBD%20Belapur%2C%20Navi%20Mumbai%2C%20Maharashtra%20400614!5e0!3m2!1sen!2sin!4v1630000000000!5m2!1sen!2sin'
    }
  ];

  const contactDetails = [
    { icon: <FiPhone />, title: 'Phone', details: ['+91 98765 43210', '+91 22 1234 5678'] },
    { icon: <FiMail />, title: 'Email', details: ['info@realestate.com', 'support@realestate.com'] },
    { icon: <FiClock />, title: 'Working Hours', details: ['Mon - Fri: 9:00 AM - 7:00 PM', 'Sat: 10:00 AM - 5:00 PM', 'Sun: Closed'] }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
          We'd love to hear from you. Reach out to us today!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Glass Map & Office Section with hover animation */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {offices.map((office, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-700/20 rounded-2xl backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <iframe
                src={office.mapSrc}
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="w-full h-56 md:h-64"
                title={`${office.title} Location`}
              ></iframe>
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white/60 dark:from-gray-800/60 backdrop-blur-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{office.title}</h3>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {office.addressLines.map((line, i) => (
                      <span key={i} className={i === office.addressLines.length - 1 ? 'font-medium' : ''}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Contact Details */}
          {contactDetails.map((info, idx) => (
            <div
              key={idx}
              className="flex items-start bg-gradient-to-r from-blue-50/60 to-white/20 dark:from-blue-900/40 dark:to-gray-800/20 p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 backdrop-blur-md"
            >
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 p-4 rounded-full text-blue-600 dark:text-blue-300">
                {info.icon}
              </div>
              <div className="ml-5">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{info.title}</h4>
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {info.details.map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Your Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              <InputField label="Email Address" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" type="email" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              <InputField label="Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help you?" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
                placeholder="Type your message here..."
                className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FiSend className="mr-2 h-5 w-5" /> Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ label, name, value, onChange, placeholder, type = 'text', required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
    />
  </div>
);

export default Contact;
