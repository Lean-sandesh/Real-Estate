// FeaturedProperties.jsx
import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { FiMapPin } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";

const FeaturedProperties = ({ properties }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
          <Link
            to="/Properties"
            className="text-blue-600 hover:underline flex items-center font-medium"
          >
            View All <IoIosArrowForward className="ml-1" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {properties && properties.length > 0 ? (
            properties.map((property) => (
              <motion.div
                key={property.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden relative group cursor-pointer transition-all"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {property.isVerified && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      Verified
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{property.title}</h3>
                  <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
                    <FiMapPin /> {property.location}
                  </p>
                  <p className="text-blue-600 font-semibold text-lg mb-2">{property.price}</p>
                  <p className="text-gray-500 text-sm mb-3">
                    {property.area} • {property.bhk}
                  </p>

                  {/* Ratings */}
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }, (_, i) =>
                      i < Math.floor(property.rating) ? (
                        <FaStar key={i} className="text-yellow-400" />
                      ) : (
                        <FaRegStar key={i} className="text-gray-300" />
                      )
                    )}
                    <span className="text-gray-500 text-sm ml-2">{property.rating}</span>
                  </div>

                  <Link
                    to={`/Properties/${property.id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No properties match your selection.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;