// components/HeroSection.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiSearch } from "react-icons/fi";

const HeroSection = ({
  heroSlides,
  currentSlide,
  tabs,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  handleSearch,
}) => {
  return (
    <section className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden text-white">
      {/* Background Image Animation */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentSlide}
          src={heroSlides[currentSlide].image}
          alt={heroSlides[currentSlide].title}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      {/* Overlay Effects */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-20 left-20 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse delay-2000"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center w-full">
        {/* Title */}
        <motion.h1
          key={heroSlides[currentSlide].title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 drop-shadow-lg"
        >
          {heroSlides[currentSlide].title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          key={heroSlides[currentSlide].subtitle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-6 drop-shadow-md"
        >
          {heroSlides[currentSlide].subtitle}
        </motion.p>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full font-semibold text-sm md:text-base transition-all
                ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                    : "bg-white/30 text-white hover:bg-white/50 backdrop-blur-sm"
                }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Search Form */}
        <motion.form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="flex items-center p-4 flex-1 border-b md:border-b-0 md:border-r border-gray-200">
            <FiMapPin className="text-blue-500 text-xl mr-3" />
            <input
              type="text"
              placeholder={`Search "${
                activeTab === "buy"
                  ? "Buy"
                  : activeTab === "rent"
                  ? "Rent"
                  : activeTab
              } properties"`}
              className="w-full focus:outline-none text-gray-700 bg-transparent placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <FiSearch /> Search
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default HeroSection;