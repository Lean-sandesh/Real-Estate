import React from "react";
import { FiPhone, FiMail, FiMapPin, FiClock, FiArrowLeft  } from "react-icons/fi";
import { FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function ContactHR() {
    const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg p-6 mt-10 rounded-xl mb-10">


          {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 mb-4 hover:text-black"
      >
        <FiArrowLeft size={20} /> Go Back
      </button>


      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-6">Contact HR</h2>

      {/* HR Image */}
      <img
        src="https://img.freepik.com/premium-photo/portrait-indian-business-manager-employee-suit_753390-10898.jpg"
        alt="HR"
        className="w-40 h-40 mx-auto rounded-full mb-4 object-cover shadow-md"
      />

      {/* HR Details */}
      <h3 className="text-xl font-semibold text-center">Sneha Deshmukh</h3>
      <p className="text-center text-gray-600">HR Manager</p>
      <p className="text-center text-gray-500 mb-4">5+ Years Experience</p>

      {/* Working Hours */}
      <div className="flex items-center gap-2 text-gray-700 justify-center mb-3">
        <FiClock className="text-blue-600" />
        Mon – Sat: 10 AM to 6 PM
      </div>

      {/* Contact Details */}
      <div className="space-y-3 mb-6">
        <p className="flex items-center gap-2 text-lg">
          <FiPhone className="text-green-600" /> +91 91665 75790
        </p>
        <p className="flex items-center gap-2 text-lg">
          <FiMail className="text-blue-600" />snehadeshmukh2001@gmail.com
        </p>
        <p className="flex items-center gap-2 text-lg">
          <FiMapPin className="text-red-600" /> Pune, Maharashtra
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-3">

        <a
          href="tel:+919876500021"
          className="bg-gray-800 text-white py-2 rounded-lg text-center text-lg"
        >
          📞 Call HR Now
        </a>

        <a
          href="https://wa.me/919876500021"
          className="bg-green-600 text-white py-2 rounded-lg text-center text-lg"
        >
          💬 WhatsApp HR
        </a>

        <a
          href="mailto:vinayakaldar2001@gmail.com"
          className="bg-blue-600 text-white py-2 rounded-lg text-center text-lg"
        >
          📩 Email HR
        </a>
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-5 mt-6 text-2xl text-gray-600">
        <FaLinkedin className="hover:text-blue-700 cursor-pointer" />
        <FaFacebook className="hover:text-blue-600 cursor-pointer" />
        <FaInstagram className="hover:text-pink-600 cursor-pointer" />
      </div>

      {/* Why Contact HR */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold mb-2">Why Contact HR?</h4>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Job openings & recruitment queries</li>
          <li>Interview scheduling</li>
          <li>Salary & joining formalities</li>
          <li>Company policy information</li>
        </ul>
      </div>

    </div>
  );
}