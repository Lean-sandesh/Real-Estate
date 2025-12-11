import React, { useEffect, useState } from "react";
import { FiUsers, FiAward, FiMapPin, FiChevronDown } from "react-icons/fi";
import {
  FaHandshake,
  FaChartLine,
  FaBuilding,
  FaRegLightbulb,
  FaHandsHelping,
  FaCheckCircle,
  FaClock,
  FaHeart,
  FaGlobe,
  FaLightbulb,
  FaUserTie,
  FaQuoteLeft,
  FaBriefcase,
} from "react-icons/fa";
import CountUp from "react-countup";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import trophy from '../assets/About/Awards/trophy.png';
import innovative from '../assets/About/Awards/innovative.png';
import certified from '../assets/About/Awards/certified.png';
import arcadia from '../assets/About/arcadia.png';
import capital from '../assets/About/capital.png'
import global from '../assets/About/global.png';
import nexus from '../assets/About/nexus.jpg';
import prestige from '../assets/About/prestige.png';
import techVentures from '../assets/About/techVentures.png';


// --- HERO DATA FOR ROTATION (5 PREMIUM LOOKS) ---
const heroSlides = [
  {
    tagline: "The Gold Standard in Real Estate",
    headline: "Investment. Innovation.",
    subtext: "We deliver *unparalleled market intelligence* and *exclusive acquisition strategies*, ensuring premium returns for discerning clients globally.",
    image: "https://images.unsplash.com/photo-1560184897-31ad6aa2d7d1?auto=format&fit=crop&w=1950&q=80",
    gradient: "from-gray-900 via-teal-900 to-cyan-900",
    accent: "text-teal-400 dark:text-cyan-400",
  },
  {
    tagline: "Exclusive Global Portfolio",
    headline: "Luxury. Legacy.",
    subtext: "Explore our *curated collection of prime international properties*—investments built for generational value and prestige.",
    image: "https://images.unsplash.com/photo-1550993096-e26b801a27e7?auto=format&fit=crop&w=1950&q=80",
    gradient: "from-gray-950 via-indigo-900 to-purple-900",
    accent: "text-purple-400 dark:text-indigo-300",
  },
  {
    tagline: "Data-Driven Decisions",
    headline: "Analytics. Advantage.",
    subtext: "*Proprietary market insights and AI-driven valuation tools* give you the crucial edge in competitive real estate markets.",
    image: "https://images.unsplash.com/photo-1556740714-a83d3170e4e6?auto=format&fit=crop&w=1950&q=80",
    gradient: "from-gray-900 via-red-900 to-orange-900",
    accent: "text-orange-400 dark:text-red-300",
  },
  {
    tagline: "Unmatched Client Service",
    headline: "Trust. Transparency.",
    subtext: "Our dedicated *24/7 concierge support* and fully transparent process redefine the client-agent relationship standard.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f618a7c5?auto=format&fit=crop&w=1950&q=80",
    gradient: "from-black via-gray-950 to-emerald-900",
    accent: "text-emerald-400 dark:text-green-300",
  },
  {
    tagline: "Sustainable & Future-Ready",
    headline: "Ecology. Equity.",
    subtext: "Pioneering investment in *sustainable and eco-friendly developments*, building a greener, more valuable portfolio for tomorrow.",
    image: "https://images.unsplash.com/photo-1588880331179-bc22320b9e84?auto=format&fit=crop&w=1950&q=80",
    gradient: "from-gray-900 via-blue-900 to-sky-900",
    accent: "text-sky-400 dark:text-blue-300",
  },
];

// --- Component Start ---

export default function About() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // HERO ROTATION EFFECT (3 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const currentSlide = heroSlides[currentSlideIndex];

  // Scroll effect for counters
  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.getElementById("stats-section");
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - (window.innerHeight / 3)) {
          setStatsVisible(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Data arrays
  const features = [
    { icon: <FaHandshake />, title: "Trusted Deals", description: "Reliable, legally vetted transactions ensuring peace of mind." },
    { icon: <FaChartLine />, title: "Market Insights", description: "Proprietary analytics for smarter, data-driven investment decisions." },
    { icon: <FaRegLightbulb />, title: "Innovative Solutions", description: "Cutting-edge VR tours and tech-driven client services." },
    { icon: <FaHandsHelping />, title: "Personal Support", description: "Dedicated 24/7 concierge service from inquiry to closing." },
    { icon: <FiUsers />, title: "Experienced Agents", description: "Top-tier agents, each with minimum 5 years of industry excellence." },
  ];

  const coreValues = [
    { title: "Integrity", icon: <FaCheckCircle />, description: "Guaranteed ethical practices for secure, worry-free transactions." },
    { title: "Transparency", icon: <FaLightbulb />, description: "Clear, upfront communication on pricing and process status." },
    { title: "Innovation", icon: <FaChartLine />, description: "Continuously improving client experience through technology." },
    { title: "Client First", icon: <FaHeart />, description: "Prioritizing your long-term satisfaction above all else." },
  ];

  const team = [
    { name: "Amit Patel", role: "CEO & Founder", specificRole: "Visionary Leader & Strategist", image: "https://i.pravatar.cc/300?img=68", bio: "Revolutionizing property search with 15+ years experience." },
    { name: "Muskan Khan", role: "Head of Sales", specificRole: "Head of Residential Sales", image: "https://i.pravatar.cc/300?img=47", bio: "Building lasting client relationships and trust." },
    { name: "Rahul Verma", role: "CTO", specificRole: "Chief Technology Officer", image: "https://i.pravatar.cc/300?img=66", bio: "Overseeing our tech platform for a seamless experience." },
    { name: "Neha Sharma", role: "Design Lead", specificRole: "Lead UX/UI Architect", image: "https://i.pravatar.cc/300?img=48", bio: "Focussed on intuitive user experience and brand consistency." },
  ];

  const testimonials = [
    { name: "Suresh Kumar", role: "Homeowner", image: "https://i.pravatar.cc/300?img=12", quote: "Leank Kei helped me find my dream home seamlessly. Highly recommended!", rating: 5 },
    { name: "Priya Singh", role: "Investor", image: "https://i.pravatar.cc/300?img=13", quote: "Professional and reliable. Excellent market insights and support.", rating: 5 },
    { name: "Rahul Sharma", role: "Tenant", image: "https://i.pravatar.cc/300?img=14", quote: "Amazing customer service and smooth property transactions.", rating: 4 },
  ];

  const awards = [
    {
      title: "Best Real Estate Agency 2024",
      logo: trophy
    },
    {
      title: "Top 10 Innovative Agencies 2023",
      logo: innovative
    },
    {
      title: "ISO 9001 Certified 2021",
      logo: certified
    },
  ];

  const partners = [
    { name: "Global Finance Inc.", logo: global },
    { name: "Arcadia Builders", logo: arcadia},
    { name: "Tech Ventures", logo: techVentures },
    { name: "Prestige Law Firm", logo: prestige  },
    { name: "Nexus Mortgages", logo: nexus },
    { name: "Capital Bank", logo: capital },
  ];

  const process = [
    { step: "Initial Consultation", icon: <FaHandshake />, description: "Detailed needs assessment and tailored market briefing." },
    { step: "Curated Selection", icon: <FaBuilding />, description: "Proprietary matching to highly vetted, exclusive properties." },
    { step: "Negotiation & Vetting", icon: <FaCheckCircle />, description: "Expert negotiation and thorough legal documentation management." },
    { step: "Final Handover", icon: <FaClock />, description: "Seamless closure, title transfer, and post-sale support." },
  ];

  const faqs = [
    { question: "How do I schedule a property visit?", answer: "You can schedule a visit through our contact page or by calling our office directly. We offer both in-person and virtual tours, with agents available 7 days a week for your convenience." },
    { question: "Do you handle legal paperwork?", answer: "Yes, our dedicated in-house legal team and seasoned agents assist with all complex legal and documentation processes to ensure a smooth, fully compliant, and stress-free transaction." },
    { question: "What are your fees?", answer: "Our service fees are 100% transparent and clearly outlined in the initial consultation agreement. They vary depending on the transaction type and complexity, with a strict policy of no hidden costs." },
    { question: "Can I sell my property through your platform?", answer: "Absolutely! We offer dedicated seller services including professional photography, precise market valuation, targeted marketing campaigns, and expert sales support to ensure you maximize your property's value." },
  ];

  // Function to render star rating
  const renderStars = (rating) => (
    <div className="flex justify-center mt-auto">
      {Array(5)
        .fill(0)
        .map((_, idx) => (
          <svg key={idx} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${idx < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.948a1 1 0 00.95.69h4.147c.969 0 1.371 1.24.588 1.81l-3.356 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.54 1.118l-3.356-2.44a1 1 0 00-1.176 0l-3.356 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.947a1 1 0 00-.364-1.118L2.028 9.375c-.783-.57-.38-1.81.588-1.81h4.147a1 1 0 00.95-.69l1.286-3.948z" />
          </svg>
        ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative overflow-hidden font-sans">
      {/* ===== DYNAMIC HERO SECTION ===== */}
      <section
        className={`relative bg-gradient-to-br ${currentSlide.gradient} py-32 sm:py-48 overflow-hidden border-b-8 border-teal-500/50 dark:border-cyan-500/50 transition-colors duration-1000 ease-in-out`}
      >
        {/* Background Overlay & Image */}
        <div className="absolute inset-0">
          <img
            key={currentSlideIndex}
            src={currentSlide.image}
            alt="Modern Architectural Interior"
            className="w-full h-full object-cover object-center opacity-10 filter grayscale brightness-50 transition-opacity duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
        </div>

        {/* Content */}
        <div
          key={`content-${currentSlideIndex}`}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in transition-opacity duration-1000 ease-in-out"
        >
          {/* Pre-Headline / Tagline */}
          <p className={`text-sm font-semibold uppercase tracking-widest ${currentSlide.accent} mb-4`}>
            {currentSlide.tagline}
          </p>

          {/* Headline - Dynamic Content */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200 drop-shadow-2xl">
              {currentSlide.headline}
            </span>
            <br />
            <span className="text-4xl sm:text-5xl lg:text-6xl font-light text-white/90 block mt-4">
              Unlocking <strong className="font-bold tracking-tight">Prime Properties.</strong>
            </span>
          </h1>

          {/* Subtext / About Us - Dynamic Content */}
          <p className="mt-8 text-xl sm:text-2xl text-gray-200/90 max-w-4xl mx-auto leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: currentSlide.subtext }}>
          </p>

          {/* Search Bar */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-5xl mx-auto bg-white/10 rounded-2xl shadow-2xl p-6 sm:p-3 border border-white/20 backdrop-blur-md">
            <input
              type="text"
              placeholder="Enter Location, Area, or Investment Code..."
              aria-label="Search by location"
              className="flex-1 px-5 py-3 rounded-xl border border-gray-700 bg-gray-900/50 focus:outline-none focus:ring-4 focus:ring-teal-400/70 transition duration-300 text-white placeholder-gray-400 w-full sm:w-auto shadow-inner"
            />
            <select aria-label="Select property type" className="flex-1 px-5 py-3 rounded-xl border border-gray-700 bg-gray-900/50 focus:outline-none focus:ring-4 focus:ring-teal-400/70 transition duration-300 text-white placeholder-gray-400 w-full sm:w-auto appearance-none">
              <option className="bg-gray-800">Investment Class</option>
              <option className="bg-gray-800">Residential Luxury</option>
              <option className="bg-gray-800">Commercial Portfolio</option>
              <option className="bg-gray-800">Land Acquisition</option>
            </select>
            <button
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:opacity-100 transition duration-300 transform hover:scale-[1.05] border border-cyan-400/50"
              aria-label="Search exclusive listings"
            >
              <FaGlobe className="inline mr-2" /> Search Exclusive
            </button>
          </div>

          {/* Credibility Stats */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 text-white text-center border-t border-b border-white/10 py-6 max-w-6xl mx-auto">
            <div role="status" aria-label="50,000 plus properties listed" className="p-2 transform transition-all duration-300 hover:scale-105 hover:bg-white/5 rounded-lg">
              <p className={`text-4xl sm:text-5xl font-extrabold ${currentSlide.accent} transition-colors duration-1000`}>50k+</p>
              <p className="text-sm mt-1 text-gray-300 font-medium tracking-wide">Vetted Listings</p>
            </div>
            <div role="status" aria-label="20,000 plus happy clients" className="p-2 transform transition-all duration-300 hover:scale-105 hover:bg-white/5 rounded-lg">
              <p className={`text-4xl sm:text-5xl font-extrabold text-cyan-400 transition-colors duration-1000`}>20k+</p>
              <p className="text-sm mt-1 text-gray-300 font-medium tracking-wide">Global Clients</p>
            </div>
            <div role="status" aria-label="15 plus years of trust" className="p-2 transform transition-all duration-300 hover:scale-105 hover:bg-white/5 rounded-lg">
              <p className={`text-4xl sm:text-5xl font-extrabold ${currentSlide.accent} transition-colors duration-1000`}>15+</p>
              <p className="text-sm mt-1 text-gray-300 font-medium tracking-wide">Years of Excellence</p>
            </div>
            <div role="status" aria-label="50 plus awards won" className="p-2 transform transition-all duration-300 hover:scale-105 hover:bg-white/5 rounded-lg">
              <p className={`text-4xl sm:text-5xl font-extrabold text-cyan-400 transition-colors duration-1000`}>₹500M+</p>
              <p className="text-sm mt-1 text-gray-300 font-medium tracking-wide">Transaction Volume</p>
            </div>
          </div>

          {/* Manual Pointers */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setCurrentSlideIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  currentSlideIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <main className="relative z-20">
        {/* ===== Mission & Vision ===== */}
        <section className="py-20 bg-white dark:bg-gray-950 text-center" id="mission-vision">
          <h2 className="text-4xl font-extrabold mb-12 text-gray-900 dark:text-white">Our <span className="text-teal-500 dark:text-cyan-400">Mission & Vision</span></h2>
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="relative bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-teal-400">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-teal-500 rounded-full p-4 shadow-xl">
                <FaChartLine className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-teal-200 mt-6">Mission</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg italic">"To make real estate transactions *simple, transparent, and stress-free* through technology and personalized service."</p>
            </div>

            <div className="relative bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-cyan-400">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-cyan-500 rounded-full p-4 shadow-xl">
                <FaGlobe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-cyan-200 mt-6">Vision</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg italic">"To become the *most trusted and innovative* real estate platform nationwide, setting the industry benchmark for client experience."</p>
            </div>
          </div>
        </section>

        <hr className="max-w-7xl mx-auto border-gray-200 dark:border-gray-800" />

        {/* ===== Founder's Letter ===== */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold mb-12 text-gray-900 dark:text-white">A <span className="text-teal-500">Message</span> From Our Founder</h2>
            <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 relative">
              <FaQuoteLeft className="absolute top-4 left-4 h-8 w-8 text-teal-400 opacity-30 dark:text-cyan-400" />
              <FaQuoteLeft className="absolute bottom-4 right-4 h-8 w-8 text-teal-400 opacity-30 transform rotate-180 dark:text-cyan-400" />
              <p className="text-xl italic text-gray-700 dark:text-gray-300 leading-relaxed mb-6 font-serif">
                "Our journey began 15 years ago with a simple belief: real estate should be an empowering experience, not a complex one. We built this company on the pillars of integrity and innovation, committed to providing not just properties, but *future-proof investments and genuine partnerships*. Every client relationship is a testament to our dedication to excellence. We look forward to helping you achieve your aspirations."
              </p>
              <div className="flex items-center justify-center mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
                <img src="https://i.pravatar.cc/100?img=68" alt="Amit Patel, CEO" className="w-16 h-16 rounded-full object-cover mr-4 shadow-lg" />
                <div className="text-left">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">Amit Patel</p>
                  <p className="text-teal-600 dark:text-cyan-400 font-medium">CEO & Founder</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="max-w-7xl mx-auto border-gray-200 dark:border-gray-800" />

        {/* ===== Features / Services ===== */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900 text-center" id="features">
          <h2 className="text-4xl font-extrabold mb-12 text-gray-900 dark:text-white">What Sets Us Apart?</h2>
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border-t-4 border-transparent dark:border-transparent transform transition duration-500 hover:scale-[1.05] hover:shadow-2xl group hover:border-teal-500 dark:hover:border-cyan-500"
              >
                <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-teal-500 group-hover:bg-cyan-500 text-white text-3xl mb-4 shadow-lg transition duration-500">
                  {f.icon}
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{f.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-md">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="max-w-7xl mx-auto border-gray-200 dark:border-gray-800" />

        {/* ===== Core Values ===== */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900 text-center">
          <h2 className="text-4xl font-extrabold mb-12 text-gray-900 dark:text-white">Our Core <span className="text-cyan-500 dark:text-teal-400">Values</span></h2>
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((v, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transform transition duration-300 hover:shadow-xl hover:border-cyan-500 group"
              >
                <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-cyan-500 group-hover:bg-teal-500 text-white text-3xl mb-4 shadow-md transition duration-300">
                  {v.icon}
                </div>
                <h4 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{v.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="max-w-7xl mx-auto border-gray-200 dark:border-gray-800" />

        {/* ===== Team ===== */}
        <section className="py-20 bg-white dark:bg-gray-950 text-center" id="team">
          <h2 className="text-4xl font-extrabold mb-10 text-gray-900 dark:text-white">Meet Our <span className="text-teal-500">Leadership Team</span></h2>
          <div className="max-w-7xl mx-auto px-4">
            <Swiper
              slidesPerView={1}
              spaceBetween={20}
              loop={true}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              modules={[Autoplay, Pagination]}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
              }}
              className="pb-12"
            >
              {team.map((m, i) => (
                <SwiperSlide key={i} className="flex justify-center">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] border-t-4 border-teal-500 dark:border-cyan-500 w-full">
                    <img src={m.image} alt={m.name} className="w-28 h-28 object-cover rounded-full mx-auto mb-4 border-4 border-white dark:border-gray-700 shadow-lg" />
                    <h4 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{m.name}</h4>
                    <p className="text-cyan-600 dark:text-teal-400 font-semibold mb-2">{m.specificRole}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-3 mb-4">{m.bio}</p>
                    <button className="text-sm text-teal-600 dark:text-cyan-400 font-semibold hover:underline mt-2">Connect on LinkedIn</button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        <hr className="max-w-7xl mx-auto border-gray-200 dark:border-gray-800" />

        {/* ===== Testimonials ===== */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900 text-center">
          <h2 className="text-4xl font-extrabold mb-12 text-gray-900 dark:text-white">What Our <span className="text-teal-500">Clients Say</span></h2>
          <div className="max-w-7xl mx-auto px-4">
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              modules={[Autoplay]}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={i} className="p-2">
                  <div className="h-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center transform transition duration-500 hover:scale-[1.03] hover:shadow-2xl border-b-4 border-cyan-500 dark:border-teal-500">
                    <img src={t.image} alt={t.name} className="w-20 h-20 rounded-full object-cover shadow-lg mb-4 border-4 border-gray-100 dark:border-gray-700" />
                    <FaQuoteLeft className="h-6 w-6 text-cyan-500 mb-2 dark:text-teal-400" />
                    <p className="text-gray-700 dark:text-gray-300 italic text-lg mb-4 flex-grow">"{t.quote}"</p>
                    {renderStars(t.rating)}
                    <h4 className="mt-3 font-bold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{t.role}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        <hr className="max-w-7xl mx-auto border-gray-200 dark:border-gray-800" />

        {/* ===== Awards & Recognitions ===== */}
        <section className="py-20 bg-white dark:bg-gray-950 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-12 text-gray-900 dark:text-white uppercase tracking-wide">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-500">
              Awards & Recognitions
            </span>
          </h2>

          <div className="max-w-7xl mx-auto px-4">
            <Swiper slidesPerView={1} spaceBetween={20} loop autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {awards.map((a, i) => (
                <SwiperSlide key={i} className="flex justify-center p-2">
                  <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-[1.03] w-full max-w-sm">
                    <img src={a.logo} alt={a.title} className="h-20 mb-4 object-contain filter grayscale hover:grayscale-0 transition duration-500" />
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-lg text-center border-t border-gray-200 dark:border-gray-700 pt-3 w-full">{a.title}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        <hr className="max-w-7xl mx-auto border-gray-200 dark:border-gray-800" />

        {/* ===== Partners / Collaborations ===== */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900 text-center">
          <h2 className="text-3xl font-extrabold mb-10 text-gray-900 dark:text-white">
            <FaBriefcase className="inline mr-3 text-teal-500 dark:text-cyan-400" />
            Our Global Partner Network
          </h2>
          <div className="max-w-7xl mx-auto px-4">
            <Swiper slidesPerView={3} spaceBetween={20} loop autoplay={{ delay: 2500, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 4, spaceBetween: 30 },
                1024: { slidesPerView: 6, spaceBetween: 40 },
              }}
            >
              {partners.map((p, i) => (
                <SwiperSlide key={i} className="flex justify-center items-center p-4">
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="h-10 sm:h-14 object-contain filter grayscale opacity-80 dark:invert dark:opacity-70 hover:grayscale-0 hover:opacity-100 transition duration-500 cursor-pointer p-2 rounded-lg hover:shadow-lg border-b-2 border-transparent hover:border-teal-400 dark:hover:border-cyan-400"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        <hr className="max-w-7xl mx-auto border-gray-200 dark:border-gray-800" />

        {/* ===== How It Works / Process ===== */}
        <section className="py-20 bg-white dark:bg-gray-950 text-center">
          <h2 className="text-4xl font-extrabold mb-12 text-gray-900 dark:text-white">Our Seamless <span className="text-cyan-500">4-Step Process</span></h2>
          <div className="flex flex-col md:flex-row justify-between gap-6 max-w-7xl mx-auto px-4">
            {process.map((p, i) => (
              <div key={i} className="relative flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-xl border-t-8 border-teal-500 dark:border-cyan-500 w-full hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group">
                <div className="absolute -top-4 w-10 h-10 flex items-center justify-center bg-teal-500 group-hover:bg-cyan-500 text-white rounded-full font-bold text-lg shadow-md transition-colors duration-300">
                  {i + 1}
                </div>
                <div className="text-4xl text-teal-600 dark:text-cyan-400 my-4 group-hover:text-cyan-600 dark:group-hover:text-teal-300 transition-colors duration-300">
                  {p.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{p.step}</h4>
                <p className="text-gray-600 dark:text-gray-400">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <hr className="max-w-7xl mx-auto border-gray-200 dark:border-gray-800" />

        {/* ===== FAQ Section ===== */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900" id="faq">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold mb-12 text-gray-900 dark:text-white">Frequently Asked <span className="text-teal-500">Questions</span></h2>
            <div className="space-y-4 text-left">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition duration-300 hover:shadow-xl">
                  <button
                    className="flex justify-between items-center w-full p-5 text-lg font-semibold text-gray-900 dark:text-white focus:outline-none"
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                    aria-expanded={faqOpen === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    {faq.question}
                    <FiChevronDown
                      className={`h-5 w-5 text-teal-500 dark:text-cyan-400 transform transition-transform duration-300 ${
                        faqOpen === index ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className={`transition-all duration-500 overflow-hidden ${
                      faqOpen === index ? 'max-h-96 opacity-100 p-5 pt-0' : 'max-h-0 opacity-0 p-0'
                    }`}
                  >
                    <p className="text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA below FAQ */}
            <div className="mt-12">
                <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">Still have questions?</p>
                <button
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.05]"
                >
                    Contact Our Support Team
                </button>
            </div>
          </div>
        </section>
      </main>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}