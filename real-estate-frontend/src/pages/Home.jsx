import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiSearch, FiCheckCircle } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { FaStar, FaRegStar, FaBed, FaBath, FaRulerCombined } from "react-icons/fa"; // Added utility icons
import { Link } from "react-router-dom";

// Components (Assuming these are available in your project structure)
// NOTE: I am commenting out the original import for PropertyCard and including an enhanced version below for a complete, runnable file structure.
// import PropertyCard from "../components/PropertyCard"; 
import UpcomingProperties from "../components/UpcomingProperties"; // Placeholder component assumed
import Testimonials from "../components/Testimonials"; // Placeholder component assumed
import TopCities from "../components/TopCities"; // Placeholder component assumed
import WhyChooseUs from "../components/WhyChooseUs"; // Placeholder component assumed
import RealEstateTools from "../components/RealEstateTools"; // Placeholder component assumed
import TopPicks from "../components/TopPicks"; // Placeholder component assumed

// Hero Images
import hero1 from "../assets/hero.png";
import hero2 from "../assets/images/mumbai3bhk.jpg";
import hero3 from "../assets/images/bangalore 4bhk.jpg";
import hero4 from "../assets/images/hyderabad 2bhk.jpg";
import hero5 from "../assets/images/pune office park.jpg";

// Featured Properties Images
import mumbai3bhk from "../assets/images/mumbai3bhk.jpg";
import bangalore4bhk from "../assets/images/bangalore 4bhk.jpg";
import hyderabad2bhk from "../assets/images/hyderabad 2bhk.jpg";
import puneoffice from "../assets/images/pune office park.jpg";

// Property Types Icons
import { FaBuilding, FaCity, FaRegBuilding } from "react-icons/fa";

// --- Data Definitions ---
const heroSlides = [
  { title: "Find Your Dream Home", subtitle: "Explore thousands of modern listings across top cities.", image: hero1 },
  { title: "Luxury Living Awaits", subtitle: "Discover premium villas, apartments, and penthouses.", image: hero2 },
  { title: "Invest Smart, Live Better", subtitle: "Trusted by thousands for real estate investments.", image: hero3 },
  { title: "Work & Live Comfortably", subtitle: "Premium office spaces in top commercial hubs.", image: hero4 },
  { title: "City Living, Redefined", subtitle: "Stylish apartments in prime locations.", image: hero5 },
];

const propertyTypes = [
  { id: "residential", name: "Residential", icon: <FaBuilding className="text-2xl" /> },
  { id: "commercial", name: "Commercial", icon: <FaBuilding className="text-2xl" /> },
  { id: "plots", name: "Plots/Land", icon: <FaRegBuilding className="text-2xl" /> },
  { id: "new-projects", name: "New Projects", icon: <FaCity className="text-2xl" /> },
];

const bhkOptions = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK+"];
const propertySources = ["Owner", "Dealer", "Builder"];

const featuredProperties = [
  { id: 1, title: "Luxury 3BHK Apartment in Mumbai", price: "₹1.5 Cr", location: "Andheri West, Mumbai", type: "Apartment", bhk: "3BHK", source: "Dealer", area: "1450", image: mumbai3bhk, rating: 4.8, isVerified: true, postedOn: "2 hours ago", beds: 3, baths: 3 },
  { id: 2, title: "Modern 4BHK Villa with Private Pool", price: "₹3.2 Cr", location: "Whitefield, Bangalore", type: "Villa", bhk: "4BHK", source: "Builder", area: "3250", image: bangalore4bhk, rating: 4.9, isVerified: true, postedOn: "5 hours ago", beds: 4, baths: 4 },
  { id: 3, title: "Elegant 2BHK Apartment near Cyber City", price: "₹95 Lakh", location: "Gachibowli, Hyderabad", type: "Apartment", bhk: "2BHK", source: "Owner", area: "1090", image: hyderabad2bhk, rating: 4.6, isVerified: true, postedOn: "1 day ago", beds: 2, baths: 2 },
  { id: 4, title: "Commercial Office Space in Pune IT Park", price: "₹2.1 Cr", location: "Hinjewadi Phase 1, Pune", type: "Commercial", bhk: "NA", source: "Builder", area: "1750", image: puneoffice, rating: 4.7, isVerified: true, postedOn: "3 days ago", beds: 0, baths: 1 },
];

// --- Enhanced Property Card Component (For cleaner Home.jsx) ---
const PropertyCard = ({ property, index }) => (
  <motion.div
    key={property.id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
    className="bg-white rounded-3xl shadow-xl overflow-hidden relative group cursor-pointer transition-all duration-300 border border-gray-100"
  >
    {/* Image */}
    <div className="relative">
      <img src={property.image} alt={property.title} className="w-full h-56 object-cover group-hover:scale-[1.02] transition-transform duration-500" />
      {property.isVerified && (
        <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <FiCheckCircle className="text-sm" /> Verified
        </span>
      )}
      <span className="absolute bottom-0 left-0 bg-black/70 text-white text-xl font-extrabold px-4 py-2 rounded-tr-xl tracking-tight">{property.price}</span>
      <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">{property.type}</span>
    </div>
    {/* Info */}
    <div className="p-6">
      <h3 className="font-extrabold text-xl text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">{property.title}</h3>
      <p className="text-gray-500 text-sm mb-4 flex items-center gap-1"><FiMapPin className="text-blue-400" /> {property.location}</p>

      {/* Quick Specs */}
      <div className="flex justify-around items-center text-sm mb-4 border-t border-b border-gray-100 py-3">
        <div className="flex items-center gap-1 text-gray-700 font-medium">
          <FaRulerCombined className="text-blue-500 text-base" />
          <span>{property.area} <span className="text-xs text-gray-500">sqft</span></span>
        </div>
        <div className="flex items-center gap-1 text-gray-700 font-medium">
          <FaBed className="text-blue-500 text-base" />
          <span>{property.beds || '-'} {property.bhk.includes("BHK") ? "" : "Beds"}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-700 font-medium">
          <FaBath className="text-blue-500 text-base" />
          <span>{property.baths || '-'} Baths</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Ratings */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) =>
            i < Math.floor(property.rating) ? (
              <FaStar key={i} className="text-yellow-500 h-4 w-4" />
            ) : (
              <FaRegStar key={i} className="text-gray-300 h-4 w-4" />
            )
          )}
          <span className="text-gray-600 text-sm ml-1 font-semibold">{property.rating}</span>
        </div>
        
        <Link
          to={`/Properties/${property.id}`}
          className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors flex items-center group-hover:scale-[1.05]"
        >
          View Details <IoIosArrowForward className="ml-1" />
        </Link>
      </div>
    </div>
  </motion.div>
);
// --- End of PropertyCard Component ---


// Main Component
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("buy");
  const [propertyType, setPropertyType] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedBHK, setSelectedBHK] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);

  const tabs = [
    { id: "buy", label: "Buy" },
    { id: "rent", label: "Rent" },
    { id: "new-launch", label: "New Launch" },
    { id: "commercial", label: "Commercial" },
    { id: "plots", label: "Plots/Land" },
    { id: "projects", label: "Projects" },
  ];

  // Hero Slider Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to Top on Load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log({ searchQuery, activeTab, propertyType, selectedBHK, selectedSource });
    // In a real app, you would navigate or fetch data here
  };

  const filteredProperties = featuredProperties.filter((property) => {
    let matchesBHK = selectedBHK ? property.bhk === selectedBHK : true;
    let matchesSource = selectedSource ? property.source === selectedSource : true;
    
    // Simple filter on Property Type as well (though primary focus is BHK/Source)
    let matchesType = propertyType === 'all' || propertyType === property.type.toLowerCase() || (propertyType === 'residential' && property.type !== 'Commercial') || (propertyType === 'commercial' && property.type === 'Commercial');

    return matchesBHK && matchesSource && matchesType;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ===== PREMIUM HERO SECTION (ENHANCED) ===== */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden text-white pt-24 pb-16">
        {/* Animated Background with Gradient Overlay */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
            />
            {/* Deeper, premium overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/50 to-black/80" />
          </motion.div>
        </AnimatePresence>

        {/* Animated Particles Background (Subtle Texture) */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm"
              style={{
                width: Math.random() * 5 + 2 + 'px',
                height: Math.random() * 5 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 backdrop-blur-sm text-sm font-medium mb-6 border border-blue-400/30 text-blue-100"
            >
              <span className="mr-2">🏡</span> Find Your Next Investment
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={heroSlides[currentSlide].title + "-h1"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-snug tracking-tight text-white drop-shadow-lg"
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              <motion.p
                key={heroSlides[currentSlide].subtitle + "-p"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Property Type Tabs (Enhanced style) */}
          <motion.div 
            className="flex justify-center gap-2 md:gap-3 mb-8 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`px-3 md:px-5 py-2 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 shadow-md
                  ${activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-xl shadow-blue-500/20"
                    : "bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-md"
                  }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Search Form (Glassmorphism Effect) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <form 
              onSubmit={handleSearch}
              className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-3xl overflow-hidden border border-white/20 p-2 md:p-3"
            >
              <div className="flex flex-col md:flex-row items-stretch">
                <div className="relative flex-1 p-2">
                  <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
                    <FiMapPin className="text-blue-300 text-xl" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by city, locality, project..."
                    className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-transparent text-white placeholder-white/70 focus:outline-none text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-2xl md:rounded-r-2xl md:rounded-l-none flex items-center justify-center gap-2 transition-all duration-300 group shadow-lg hover:shadow-xl m-2 md:m-0"
                >
                  <FiSearch className="text-xl group-hover:scale-105 transition-transform" />
                  <span className="hidden sm:inline">Search Now</span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* Trust Badges (More subtle and professional) */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-sm text-white/70 mb-6 uppercase tracking-widest font-medium">Verified Listings & Trusted by Industry Leaders</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-80">
              {/* Replace with actual logos/SVG components for a real project */}
              <div className="h-6 sm:h-8 w-auto">
                <svg className="h-full w-auto text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 200 50"><text x="0" y="38" fontFamily="sans-serif" fontSize="30" fontWeight="bold">RE-MAX</text></svg>
              </div>
              <div className="h-6 sm:h-8 w-auto">
                <svg className="h-full w-auto text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 200 50"><text x="0" y="38" fontFamily="sans-serif" fontSize="30" fontWeight="bold">DLF</text></svg>
              </div>
              <div className="h-6 sm:h-8 w-auto">
                <svg className="h-full w-auto text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 200 50"><text x="0" y="38" fontFamily="sans-serif" fontSize="30" fontWeight="bold">TATA</text></svg>
              </div>
              <div className="h-6 sm:h-8 w-auto">
                <svg className="h-full w-auto text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 200 50"><text x="0" y="38" fontFamily="sans-serif" fontSize="30" fontWeight="bold">GODREJ</text></svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        >
          <span className="text-sm text-white/70 mb-2">Explore below</span>
          <svg className="w-6 h-6 text-white/70 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>
      
      {/* --- */}

      {/* Top Picks (Assuming TopPicks is a separate component)*/}
      <TopPicks/>

      {/* --- */}

      {/* ===== PROPERTY TYPES (ENHANCED) ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3 drop-shadow-sm">Browse by <span className="text-blue-600">Property Type</span></h2>
          <p className="text-gray-600 mb-12 text-lg">Choose from top categories tailored for your specific needs</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {propertyTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setPropertyType(propertyType === type.id ? 'all' : type.id)} // Added toggle functionality
                className={`cursor-pointer group p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                  propertyType === type.id ? "border-blue-600 ring-4 ring-blue-100" : "border-gray-100 hover:border-blue-300"
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                  {type.icon}
                </div>
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 text-xl">{type.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{type.id.charAt(0).toUpperCase() + type.id.slice(1)} Listings</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- */}

      {/* ===== BHK Selection (Integrated with Featured Properties) & Property Source Selection ===== */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Refine Your Search</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {/* BHK Options */}
            <h3 className="w-full text-lg font-semibold text-gray-700 mb-2">Bedrooms (BHK)</h3>
            {bhkOptions.map((bhk) => (
              <motion.button
                key={bhk}
                onClick={() => setSelectedBHK(selectedBHK === bhk ? null : bhk)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full font-medium transition-all text-sm shadow-md ${
                  selectedBHK === bhk ? "bg-blue-600 text-white shadow-blue-500/50" : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50"
                }`}
              >
                {bhk}
              </motion.button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Property Source Options */}
            <h3 className="w-full text-lg font-semibold text-gray-700 mb-2">Source</h3>
            {propertySources.map((source) => (
              <motion.button
                key={source}
                onClick={() => setSelectedSource(selectedSource === source ? null : source)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full font-medium transition-all text-sm shadow-md ${
                  selectedSource === source ? "bg-indigo-600 text-white shadow-indigo-500/50" : "bg-white text-gray-700 border border-gray-200 hover:bg-indigo-50"
                }`}
              >
                {source}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* --- */}

      {/* ===== FEATURED PROPERTIES (USING ENHANCED CARD) ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
            <h2 className="text-4xl font-extrabold text-gray-900">Premium Featured Properties</h2>
            <Link to="/Properties" className="text-blue-600 hover:text-blue-700 flex items-center font-semibold group border border-blue-600 px-4 py-2 rounded-lg transition-all hover:bg-blue-600 hover:text-white">
              View All Listings <IoIosArrowForward className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property, index) => (
                <PropertyCard property={property} index={index} key={property.id} />
              ))
            ) : (
              <p className="col-span-full text-center text-lg text-gray-500 py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">No properties match your current filters. Try adjusting your selections!</p>
            )}
          </div>
        </div>
      </section>

      {/* --- */}

      <UpcomingProperties />
      <TopCities />

      {/* --- */}

      {/* ===== REAL ESTATE TOOLS (Enhanced Section Style) ===== */}
      <section className="py-20 relative bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Smart <span className="text-blue-600">Real Estate Tools</span>
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Analyze prices, compare properties, and make confident decisions with our comprehensive tools.
          </p>
          <RealEstateTools />
        </div>
      </section>

      {/* --- */}

      <WhyChooseUs />
      <Testimonials />

      {/* --- */}

      {/* ===== CALL TO ACTION (CTA - Premium Footer) ===== */}
      <section className="py-16 bg-blue-700 text-white text-center shadow-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 drop-shadow-md">Ready to find your dream home?</h2>
          <p className="text-lg text-blue-100 mb-8">Join thousands of happy homeowners who trusted us to make their dream a reality.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/Properties"
              className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-[1.02]"
            >
              Browse Properties
            </Link>
            <Link
              to="/Agents"
              className="border-2 border-white text-white hover:bg-white/20 font-medium py-3 px-8 rounded-full transition-all transform hover:scale-[1.02]"
            >
              Contact an Expert Agent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}