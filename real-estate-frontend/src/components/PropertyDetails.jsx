import React from "react";
import { useParams, Link } from "react-router-dom";

import mumbai3bhk from "../assets/images/mumbai3bhk.jpg";
import bangalore4bhk from "../assets/images/bangalore 4bhk.jpg";
import hyderabad2bhk from "../assets/images/hyderabad 2bhk.jpg";
import puneoffice from "../assets/images/pune office park.jpg";

const properties = [
  { id: 1, title: "Luxury 3BHK Apartment in Mumbai", price: "₹1.5 Cr", location: "Andheri West, Mumbai", type: "Apartment", bhk: "3BHK", source: "Dealer", area: "1450 sqft", image: mumbai3bhk, rating: 4.8, isVerified: true, postedOn: "2 hours ago" },
  { id: 2, title: "Modern 4BHK Villa with Private Pool", price: "₹3.2 Cr", location: "Whitefield, Bangalore", type: "Villa", bhk: "4BHK", source: "Builder", area: "3250 sqft", image: bangalore4bhk, rating: 4.9, isVerified: true, postedOn: "5 hours ago" },
  { id: 3, title: "Elegant 2BHK Apartment near Cyber City", price: "₹95 Lakh", location: "Gachibowli, Hyderabad", type: "Apartment", bhk: "2BHK", source: "Owner", area: "1090 sqft", image: hyderabad2bhk, rating: 4.6, isVerified: true, postedOn: "1 day ago" },
  { id: 4, title: "Commercial Office Space in Pune IT Park", price: "₹2.1 Cr", location: "Hinjewadi Phase 1, Pune", type: "Commercial", bhk: "NA", source: "Builder", area: "1750 sqft", image: puneoffice, rating: 4.7, isVerified: true, postedOn: "3 days ago" },
];

const PropertyDetails = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === parseInt(id));

  if (!property) {
    return <p className="text-center text-gray-500">Property not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
        
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
        {/* Info Section */}
        <div className="flex justify-center">
          <img
            src={property.image}
            alt={property.title}
            className="w-full max-w-2xl h-[400px] object-cover rounded-lg shadow-md"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{property.title}</h1>
        <p className="text-blue-600 text-2xl font-semibold mb-4">{property.price}</p>

        <div className="space-y-2 text-gray-600 mb-6">
          <p><span className="font-medium">Location:</span> {property.location}</p>
          <p><span className="font-medium">Area:</span> {property.area}</p>
          <p><span className="font-medium">Type:</span> {property.type}</p>
          <p><span className="font-medium">BHK:</span> {property.bhk}</p>
          <p><span className="font-medium">Source:</span> {property.source}</p>
          <p><span className="font-medium">Posted:</span> {property.postedOn}</p>
        </div>

        {/* Ratings */}
        <div className="flex justify-center items-center gap-1 mb-6">
          {Array.from({ length: 5 }, (_, i) =>
            i < Math.floor(property.rating) ? (
              <span key={i} className="text-yellow-400 text-xl">★</span>
            ) : (
              <span key={i} className="text-gray-300 text-xl">☆</span>
            )
          )}
          <span className="ml-2 text-gray-600">{property.rating}</span>
        </div>

        {/* Back Button */}
        <Link
          to="/Properties"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all mb-8"
        >
          ← Back to Properties
        </Link>

        {/* Image below info */}
        
      </div>
    </div>
  );
};

export default PropertyDetails;