import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiShare2, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaBed, FaBath, FaRulerCombined, FaParking, FaSwimmingPool, FaWifi, FaTv, FaSnowflake, FaDumbbell, FaUtensils, FaCoffee, FaWineGlassAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaArrowRight } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import similarProperties from '../data/similarProperties.json';

// Mock data - in a real app, this would come from an API
const mockProperty = {
  id: 1,
  title: 'Luxury 3BHK Apartment in Mumbai',
  price: '₹1.5 Cr',
  pricePerSqft: '₹10,345/sq.ft',
  location: 'Andheri West, Mumbai, Maharashtra',
  address: '1202, Tower B, Oberoi Esquire, Andheri West, Mumbai, Maharashtra 400053',
  type: 'Apartment',
  area: '1450 sqft',
  carpetArea: '1250 sqft',
  status: 'Ready to Move',
  age: 'New Launch',
  facing: 'East',
  totalFloors: 25,
  floorNo: 12,
  description: 'This luxurious 3BHK apartment is located in the heart of Andheri West, offering a perfect blend of comfort and style. The property features a spacious living room, modern kitchen with modular fittings, and elegant flooring throughout. The master bedroom comes with an attached bathroom and walk-in closet. The apartment offers a stunning view of the city skyline and is equipped with all modern amenities.',
  amenities: [
    { name: 'Lift', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Power Backup', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Water Supply', icon: <FaArrowRight className="text-gray-600" /> },
    { name: 'Parking', icon: <FaParking className="text-gray-600" /> },
    { name: 'Swimming Pool', icon: <FaSwimmingPool className="text-gray-600" /> },
    { name: 'Gym', icon: <FaDumbbell className="text-gray-600" /> },
    { name: 'WiFi', icon: <FaWifi className="text-gray-600" /> },
    { name: 'TV', icon: <FaTv className="text-gray-600" /> },
    { name: 'AC', icon: <FaSnowflake className="text-gray-600" /> },
    { name: 'Cafeteria', icon: <FaCoffee className="text-gray-600" /> },
    { name: 'Restaurant', icon: <FaUtensils className="text-gray-600" /> },
    { name: 'Bar', icon: <FaWineGlassAlt className="text-gray-600" /> },
  ],
  images: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1616486338815-3e98d3f7d0b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
  ],
  agent: {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@estatepro.com',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    company: 'EstatePro Realtors',
    experience: '8 years',
    propertiesListed: 245,
    rating: 4.9,
    reviews: 128,
  }
};

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // In a real app, fetch property data based on ID
  useEffect(() => {
    // Simulate API call
    const fetchProperty = () => {
      setTimeout(() => {
        setProperty(mockProperty);
        setLoading(false);
      }, 500);
    };

    fetchProperty();
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, update favorite status in the backend
  };

  const handleContactAgent = (method) => {
    // In a real app, this would trigger a call/email/chat
    switch (method) {
      case 'call':
        window.location.href = `tel:${property.agent.phone}`;
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${property.agent.phone.replace(/\D/g, '')}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:${property.agent.email}`;
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Property not found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const displayedAmenities = showAllAmenities 
    ? property.amenities 
    : property.amenities.slice(0, 6);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Back Button */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            <FiChevronLeft className="mr-1" /> Back to results
          </button>
        </div>
      </div>

      {/* Property Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mt-2">
                <FiMapPin className="mr-1" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FiHeart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <FiShare2 className="h-6 w-6" />
              </button>
              <div className="hidden md:block bg-primary text-white px-6 py-2 rounded-lg font-medium">
                {property.price}
              </div>
            </div>
          </div>
          
          <div className="md:hidden mt-4 bg-primary text-white px-4 py-2 rounded-lg font-medium inline-block">
            {property.price}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden mb-6" style={{ paddingBottom: '60%' }}>
              <img
                src={property.images[currentImageIndex]}
                alt={`Property ${currentImageIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md focus:outline-none"
                aria-label="Previous image"
              >
                <FiChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md focus:outline-none"
                aria-label="Next image"
              >
                <FiChevronRight className="h-6 w-6" />
              </button>
              
              {/* Image Thumbnails */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-2 py-1 rounded">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>
            
            {/* Image Thumbnails Grid (for larger screens) */}
            <div className="hidden md:grid grid-cols-4 gap-2 mb-8">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative overflow-hidden rounded-lg ${currentImageIndex === index ? 'ring-2 ring-primary' : ''}`}
                  style={{ paddingBottom: '75%' }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            {/* Property Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Property Details</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Property Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">{property.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="font-medium text-gray-900 dark:text-white">{property.price} <span className="text-sm text-gray-500">({property.pricePerSqft})</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
                  <p className="font-medium text-gray-900 dark:text-white">{property.area} <span className="text-sm text-gray-500">({property.carpetArea} carpet)</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-medium text-gray-900 dark:text-white">{property.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Floors</p>
                  <p className="font-medium text-gray-900 dark:text-white">Floor {property.floorNo} of {property.totalFloors}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Facing</p>
                  <p className="font-medium text-gray-900 dark:text-white">{property.facing}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>
            
            {/* Amenities */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Amenities</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {displayedAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mr-2 text-primary">
                      {amenity.icon}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{amenity.name}</span>
                  </div>
                ))}
              </div>
              
              {property.amenities.length > 6 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-4 text-primary hover:text-primary-dark font-medium flex items-center"
                >
                  {showAllAmenities ? 'Show Less' : `+${property.amenities.length - 6} More`}
                </button>
              )}
            </div>
            
            {/* Location */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{property.address}</p>
              
              {/* Map Placeholder */}
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FiMapPin className="mx-auto h-12 w-12 mb-2" />
                    <p>Map of {property.location}</p>
                  </div>
                </div>
                {/* In a real app, you would use Google Maps or similar */}
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>Landmarks:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Andheri Railway Station - 1.2 km</li>
                  <li>Infinity Mall - 2.5 km</li>
                  <li>Juhu Beach - 3.8 km</li>
                  <li>Mumbai Airport - 6.2 km</li>
                </ul>
              </div>
            </div>
            
            {/* Similar Properties */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Similar Properties</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarProperties.map((similar) => (
                  <div key={similar.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <Link to={`/property/${similar.id}`}>
                      <div className="relative">
                        <img 
                          src={similar.image} 
                          alt={similar.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md">
                          <FiHeart className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">{similar.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-2">
                          <FiMapPin className="mr-1" size={12} />
                          <span className="line-clamp-1">{similar.location}</span>
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-primary">{similar.price}</span>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaBed className="mr-1" />
                            <span className="mr-3">{similar.beds}</span>
                            <FaBath className="mr-1" />
                            <span>{similar.baths}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Contact Agent */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Agent</h2>
              
              <div className="flex items-center mb-6">
                <img 
                  src={property.agent.image} 
                  alt={property.agent.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{property.agent.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{property.agent.company}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(property.agent.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({property.agent.reviews})</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleContactAgent('call')}
                  className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  <FaPhoneAlt className="mr-2" />
                  Call Now
                </button>
                
                <button
                  onClick={() => handleContactAgent('whatsapp')}
                  className="w-full flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  <FaWhatsapp className="mr-2 text-xl" />
                  WhatsApp
                </button>
                
                <button
                  onClick={() => handleContactAgent('email')}
                  className="w-full flex items-center justify-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  <FaEnvelope className="mr-2" />
                  Email Agent
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Schedule a Visit</h3>
                <div className="space-y-3">
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <select
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800"
                  >
                    <option>Select Time</option>
                    <option>9:00 AM - 10:00 AM</option>
                    <option>10:00 AM - 11:00 AM</option>
                    <option>11:00 AM - 12:00 PM</option>
                    <option>2:00 PM - 3:00 PM</option>
                    <option>3:00 PM - 4:00 PM</option>
                    <option>4:00 PM - 5:00 PM</option>
                  </select>
                  <button className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg font-medium transition-colors">
                    Schedule Visit
                  </button>
                </div>
              </div>
            </div>
            
            {/* Price Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Price Trends</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Price in {property.location.split(',')[0]}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">₹12,500/sq.ft</p>
                  <p className="text-sm text-green-600">+5.2% from last year</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price per sq.ft (This Project)</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{property.pricePerSqft}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">EMI Calculator</p>
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Estimated EMI</p>
                    <p className="text-xl font-bold text-primary">₹78,450/month</p>
                    <p className="text-xs text-gray-500 mt-1">For 20 years at 8.5% interest</p>
                    <button className="mt-2 text-sm text-primary hover:underline">View EMI Plan</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Safety Tips */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Safety Tips for Buyers</h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Never pay any advance before visiting the property</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Verify all documents before making any payment</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Meet the agent in person before finalizing the deal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
