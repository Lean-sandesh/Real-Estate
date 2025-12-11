import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaHeart, FaRegHeart, FaStar, FaMapMarkerAlt, FaShare, FaRegBookmark } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { motion } from 'framer-motion';
import { FiMapPin } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useFavorites } from "../context/FavoritesContext";



export default function PropertyCard({ property }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [current, setCurrent] = useState(0);




  // If images is array of objects -> extract url & label
  const imgArray = property?.images?.length
    ? property.images
    : property.image
      ? [{ url: property.image, label: property.title }]
      : [{ url: "https://via.placeholder.com/600", label: "No Image" }];


  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % imgArray.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((prev) =>
      prev === 0 ? imgArray.length - 1 : prev - 1
    );
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };


  // Format price
  const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    return price;
  };


  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col border border-gray-200"
      whileHover={{ y: -5 }}
    >
      {/* Premium Badge */}
      {property.isPremium && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-md z-10">
          Premium
        </div>
      )}

      {/* Verified Badge */}
      {property.isVerified && (
        <span className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs z-10">
          Verified
        </span>
      )}


      {/* Property Image */}
      <div className="relative h-48 overflow-hidden">
        {/* 👁 Views Badge */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md z-20 pointer-events-none">
          👁 {property.views ?? 0}
        </div>

        <Link to={`/property/${property.id}`} className="block h-full">
          <img
            src={imgArray[current]?.url}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Image Label (Hall, Bedroom, Kitchen etc) */}

        <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-xs py-2 text-center z-20">
          {imgArray[current]?.label}
        </div>

        {/* Arrows only if multiple images */}
        {imgArray.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
            >
              <FiChevronLeft />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
            >
              <FiChevronRight />
            </button>
          </>
        )}


        {/* Posted Time */}
        {/* {property.postedOn && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {property.postedOn}
          </div>
        )} */}
      </div>


      {/* Property Details */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Title and Favorite */}
        <div className="flex justify-between items-start mb-2 gap-3">

          <h2 className="text-lg font-semibold flex-1 min-w-0 break-words leading-tight">
            <Link
              to={`/property/${property.id}`}
              className="hover:text-blue-600"
            >
              {property.title}
            </Link>
          </h2>
          <button
            onClick={toggleFavorite}
            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1"
          >
            {isFavorite(property.id) ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegBookmark className="text-xl" />
            )}
          </button>

        </div>




        {/* LOCATION */}
        <p className="text-gray-500 flex items-center gap-1 mt-1 text-sm">
          <FiMapPin className="text-gray-400" /> {property.location}
        </p>


        {/* PRICE */}
        <p className="text-blue-600 font-bold text-xl mt-2">
          {property.price}
        </p>

        {/* AREA + BHK */}
        <p className="text-gray-600 text-sm mt-3">
          {property.area} • {property.bhk}
        </p>

        {/* RATING */}
        {/* <div className="flex items-center gap-1 mt-2 text-yellow-500">
          ⭐⭐⭐⭐☆ <span className="text-gray-600 ml-1">{property.rating}</span>
        </div> */}

        {/* Property Features */}
        <div className="mt-auto">


          <div className="mt-3 flex items-center justify-between">
            {/* <div className="flex items-center">
    <span className="text-xs text-gray-500 ml-2">
      ({property.reviews || 0} reviews)
    </span>
  </div> */}

            {/* Posted Time */}
            <span className="text-xs text-gray-500">
              {property.postedOn || "Recently added"}
            </span>
          </div>
        </div>

        {/* BUTTON */}
        <Link to={`/property/${property.id}`}>
          <button className="mt-4 bg-blue-600 text-white w-full py-2 rounded-lg font-medium hover:bg-blue-700">
            View Details
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

// Add PropTypes for better development experience
PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number,
    beds: PropTypes.number,
    baths: PropTypes.number,
    isFeatured: PropTypes.bool,
  }).isRequired,
};
