import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import innovativeHome from "../assets/TopPicks/innovative-house.jpg"
import royalHome from "../assets/TopPicks/royal-homes.jpg"
import homeLuxuria from "../assets/TopPicks/home-luxuria.jpg"
import premiumResidency from "../assets/TopPicks/premium-residency.jpg"
import heightApartments from "../assets/TopPicks/height-apartments.jpg"
import lavishFloors from "../assets/TopPicks/lavish-floors.jpg"

const TopPicks = () => {
  const projects = [
    {
      id: 1,
      name: "Guru Ji Innovative Homes",
      builder: "Guru Ji Homes And Developer",
      location: "Dwarka Mor, South West Delhi",
      price: "₹60.0 L - 1.0 Cr",
      bhk: "3 BHK Builder Floor",
      image: innovativeHome,
    },
    {
      id: 2,
      name: "Elegant Royal Homes",
      builder: "Elegant Group",
      location: "Paschim Vihar, Delhi",
      price: "₹1.2 Cr - 4.8 Cr",
      bhk: "3 BHK Builder Floor",
      image: royalHome
    },

    {
      id: 3,
      name: "Guru Ji Home Luxuria",
      builder: "Guru Ji Developers",
      location: "Najafgarh, Delhi",
      price: "₹50.0 L - 90 L",
      bhk: "2 & 3 BHK",
      image: homeLuxuria,
    },
    {
      id: 4,
      name: "Shivam Premium Residency",
      builder: "Shivam Constructions",
      location: "Rohini Sector 22, Delhi",
      price: "₹85.0 L - 1.5 Cr",
      bhk: "3 & 4 BHK",
      image: premiumResidency,
    },

    {
      id: 5,
      name: "Skyline Heights Apartment",
      builder: "Skyline Builders",
      location: "Janakpuri, New Delhi",
      price: "₹1.2 Cr - 2.4 Cr",
      bhk: "2, 3 & 4 BHK Apartments",
      image: heightApartments,
    },
    {
      id: 6,
      name: "Guru Ji Lavish Floors",
      builder: "Guru Ji Homes And Developer",
      location: "Uttam Nagar, Delhi",
      price: "₹75.0 L - 1.2 Cr",
      bhk: "3 BHK Luxury Floor",
      image: lavishFloors,
    },
  ];

  const [selected, setSelected] = useState(projects[0]);

  useEffect(() => {
    // Ensure Swiper navigation buttons are initialized
  }, []);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-1">Real Estate's top picks</h2>
      <p className="text-gray-600 mb-8">Explore top living options with us</p>

      <div className="relative">
        {/* Custom Navigation Buttons */}
        <div className="custom-prev absolute top-1/2 -left-3 transform -translate-y-1/2 z-10">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="custom-next absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
          <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          slidesPerView={3}
          spaceBetween={20}
          className="mb-8"
          breakpoints={{
            0: { slidesPerView: 1.5 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {projects.map((p) => (
            <SwiperSlide key={p.id}>
              <div
                onClick={() => setSelected(p)}
                className={`cursor-pointer border rounded-xl overflow-hidden shadow-sm transition-all ${selected.id === p.id ? "border-purple-500 shadow-lg" : "border-gray-200"
                  }`}
              >
                <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
                <p className="p-3 font-medium text-sm truncate">{p.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Selected Project Details */}
      <div className="flex flex-col lg:flex-row gap-6 bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-3xl shadow-xl">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <img src={selected.image} className="w-20 h-20 object-cover rounded-xl" alt="" />
            <div>
              <h3 className="text-xl font-bold">{selected.builder}</h3>
              {/* <button className="text-blue-500 text-sm underline">View Projects</button> */}
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2">{selected.name}</h2>
          <p className="text-gray-700 mb-2">{selected.location}</p>
          <p className="text-lg font-semibold text-gray-900">{selected.price}</p>
          <p className="text-sm text-gray-800">{selected.bhk}</p>
          <Link to="/Contact">
                      <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-xl">Contact Now</button>

          </Link>
        </div>

        <div className="flex-1">
          <div className="w-full h-64 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={selected.image}
              alt={selected.name}
              className="w-full h-full object-cover transition duration-500 ease-in-out"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopPicks;