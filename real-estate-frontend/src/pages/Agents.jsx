import React, {useState} from 'react';
import { FiPhone, FiMail, FiMapPin, FiStar } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Link } from "react-router-dom";

// Mock data for agents
const agents = [
  {
    id: 1,
    name: 'Rahul Sharma',
    title: 'Senior Real Estate Agent',
    image: 'https://www.constructionweekonline.in/cloud/2022/12/15/AmFI3uBe-Siddhart-Goel-1-1200x1201.jpg',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@realestate.com',
    location: 'Mumbai, India',
    experience: '12+ years',
    properties: 245,
    rating: 4.9,
    description: 'Specializing in luxury properties and commercial real estate in South Mumbai.',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#'
    }
  },
  {
    id: 2,
    name: 'Priya Patel',
    title: 'Luxury Home Specialist',
    image: 'https://images.timesnownews.com/thumb/msid-119158435,thumbsize-24784,width-1280,height-720,resizemode-75/119158435.jpg',
    phone: '+91 98765 43211',
    email: 'priya.patel@realestate.com',
    location: 'Bangalore, India',
    experience: '8+ years',
    properties: 187,
    rating: 4.8,
    description: 'Expert in luxury villas and gated communities in prime Bangalore locations.',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#'
    }
  },
  {
    id: 3,
    name: 'Amit Singh',
    title: 'Commercial Property Expert',
    image: 'http://www.track2realty.track2media.com/wp-content/uploads/2012/12/Brotin-Banerjee_MD-CEO-at-Tata-Housing.jpg',
    phone: '+91 98765 43212',
    email: 'amit.singh@realestate.com',
    location: 'Delhi NCR, India',
    experience: '15+ years',
    properties: 312,
    rating: 4.9,
    description: 'Specializing in commercial properties and office spaces in Delhi NCR.',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#'
    }
  },
  {
    id: 4,
    name: 'Ananya Reddy',
    title: 'Residential Property Specialist',
    image: 'https://repleteinc.com/wp-content/uploads/2021/10/replete-employee.jpg',
    phone: '+91 98765 43213',
    email: 'ananya.reddy@realestate.com',
    location: 'Hyderabad, India',
    experience: '7+ years',
    properties: 156,
    rating: 4.7,
    description: 'Expert in residential properties and new developments in Hyderabad.',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#'
    }
  },
  {
    id: 5,
    name: 'Vikram Bhosale',
    title: 'Senior Commercial Real Estate Consultant',
    image: 'https://tse3.mm.bing.net/th/id/OIP.FGXPANbJ2zYz5gcf87vkRgHaJ4?pid=Api&h=220&P=0',
    phone: '+91 88556 77012',
    email: 'vikram.bhosale@commercialhub.in',
    location: 'Pune, Maharashtra, India',
    experience: '13+ years',
    properties: 310,
    rating: 4.9,
    description: 'Specializing in IT parks, warehouse leasing, and industrial properties in Pune & Chakan MIDC.',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#'
    }
  },
  {
    id: 6,
    name: 'Aishwarya Menon',
    title: 'Luxury Residential Property Advisor',
    image: 'https://imgv3.fotor.com/images/slider-image/a-woman-in-a-suit.png',
    phone: '+91 90903 33321',
    email: 'aishwarya.menon@elitevilla.in',
    location: 'Bengaluru, Karnataka, India',
    experience: '8+ years',
    properties: 195,
    rating: 4.7,
    description: 'Expert in premium villas, upscale townships, and gated communities in Bengaluru (Whitefield + Indiranagar).',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#'
    }
  },
  {
    id: 7,
    name: 'Karan Desai',
    title: 'Premium Rental & Corporate Leasing Specialist',
    image: 'https://static.toiimg.com/imagenext/toiblogs/photo/blogs/wp-content/uploads/2017/11/blog-picture.jpg',
    phone: '+91 95123 22110',
    email: 'karan.desai@cityrentals.in',
    location: 'Hyderabad, Telangana, India',
    experience: '6+ years',
    properties: "150",
    rating: 4.6,
    description: 'Focused on expat housing, corporate lease agreements, and relocation rentals.',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#'
    }
  },
  {
    id: 8,
    name: 'Neha Soni',
    title: 'Premium Rentals & Leasing Expert',
    image: 'https://img.freepik.com/premium-photo/young-professional-indian-woman-smiling-giving-thumbs-up-gesture-showing-confidence-positivity-busy-environment_822916-4056.jpg',
    phone: '+91 98670 44821',
    email: 'neha.soni@rentpremium.in',
    location: 'Pune, India',
    experience: '6+ years',
    properties: 140,
    rating: 4.5,
    description: 'Handles high-budget rentals, corporate lease agreements, and relocation support for expats & MNCs.',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#'
    }
  },
  {
    id: 9,
    name: 'Aditya Khanna',
    title: 'Luxury Homes & Investment Specialist',
    image: 'https://media.istockphoto.com/id/1363118407/photo/portrait-of-young-businessman.jpg?s=612x612&w=0&k=20&c=e9xjo1AdlIbr7ttZe3iBG3CBWKUBwdTMLkPus9DxA_s=',
    phone: '+91 90823 55147',
    email: 'aditya.khanna@luxuryestate.in',
    location: 'Mumbai, India',
    experience: '9+ years',
    properties: 160,
    rating: 4.7,
    description: 'Specializes in luxury villas, high-end residential projects, and premium real estate investments for HNI clients.',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#',
      instagram: '#'
    }
  }
];

const Agents = () => {

   const [searchText, setSearchText] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState({});


  const normalize = (str) => str.toLowerCase();

  const [showForm, setShowForm] = useState(false);
const [selectedAgent, setSelectedAgent] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 4;

const [formData, setFormData] = useState({
  name: "",
  phone: "",
  message: ""
});

const openForm = (agent) => {
  setSelectedAgent(agent);
  setShowForm(true);
};

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const sendInquiry = () => {
  let whatsappMessage = `Hello, I am ${formData.name}.%0AContact: ${formData.phone}%0A${formData.message}`;

  window.open(
    `https://wa.me/${selectedAgent.phone.replace(/\s+/g, '')}?text=${whatsappMessage}`
  );

  setShowForm(false);
};

  // ✅ filtering logic
  const filteredAgents = agents
    .filter((agent) =>
      normalize(agent.name).includes(normalize(searchText)) ||
      normalize(agent.location).includes(normalize(searchText))
    )
    .filter((agent) =>
      filterLocation ? normalize(agent.location).includes(normalize(filterLocation)) : true
    )
    .sort((a, b) => {
    if (sortValue === "experience") {
      const expA = parseInt(a.experience); // ✅ "12+ years" → 12
      const expB = parseInt(b.experience);
      return expB - expA;
    }
    if (sortValue === "rating") return b.rating - a.rating;
    if (sortValue === "properties") return b.properties - a.properties;
    return 0;
  });

  // ✅ Pagination Logic (Slice)
  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);
  const indexOfLast = currentPage * agentsPerPage;
  const indexOfFirst = indexOfLast - agentsPerPage;
  const paginatedAgents = filteredAgents.slice(indexOfFirst, indexOfLast);




const submitReview = (agentId) => {
  const agentReview = newReview[agentId];
  if (!agentReview || agentReview.rating === 0 || agentReview.comment.trim() === "") return;

  const updated = {
    ...reviews,
    [agentId]: [
      ...(reviews[agentId] || []),
      { rating: agentReview.rating, comment: agentReview.comment }
    ]
  };

  setReviews(updated);

  // clear review for that agent
  setNewReview({ 
    ...newReview, 
    [agentId]: { rating: 0, comment: "" } 
  });
};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Expert Agents</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Meet our team of experienced real estate professionals</p>
      </div>

      

      {/* Search and Filter */}
      <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search agents by name or location"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}            
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi NCR</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="pune">Pune</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="experience">Experience</option>
            <option value="rating">Rating</option>
            <option value="properties">Properties</option>
          </select>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paginatedAgents.map((agent) => (



          <div key={agent.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
                       hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.03]
                       transform transition-all duration-300 cursor-pointer">
            <div className="relative">
              <img
                src={agent.image}
                alt={agent.name}
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full flex items-center">
                <FiStar className="mr-1" />
                {agent.rating}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400">{agent.title}</p>
                </div>
                <div className="flex space-x-2">
                  <a href={agent.social.facebook} className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                    <FaFacebook className="h-5 w-5" />
                  </a>
                  <a href={agent.social.twitter} className="text-gray-500 hover:text-blue-400 dark:hover:text-blue-400">
                    <FaTwitter className="h-5 w-5" />
                  </a>
                  <a href={agent.social.linkedin} className="text-gray-500 hover:text-blue-700 dark:hover:text-blue-400">
                    <FaLinkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>              
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{agent.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <div className="flex items-center">
                  <FiMapPin className="mr-2 text-blue-600 dark:text-blue-400" />
                  <span>{agent.location}</span>
                </div>
                <div className="flex items-center">
                  <FiPhone className="mr-2 text-blue-600 dark:text-blue-400" />
                  <a href={`tel:${agent.phone.replace(/\s+/g, '')}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                    {agent.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <FiMail className="mr-2 text-blue-600 dark:text-blue-400" />
                  <a href={`mailto:${agent.email}`} className="hover:text-blue-600 dark:hover:text-blue-400 truncate">
                    {agent.email}
                  </a>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 mb-3">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{agent.experience}</span> Experience
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{agent.properties}</span> Properties
                </div>
              </div>
              
            <Link
             to={`/agent/${agent.id}`}
             className="w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 duration-200 mb-3 shadow-md block"
              >View Listings
            </Link>             


              {/* WhatsApp Button */}
              <div className="flex items-center justify-between gap-3">
            <a
            href={`https://wa.me/${agent.phone.replace(/\s+/g, '')}`}
            target="_blank"
            className="flex-1 bg-green-600 text-white py-2 rounded-md text-center hover:bg-green-700 duration-200"
            >
            WhatsApp
            </a>

                {/* Inquiry Modal Open Button */}
          <button
            onClick={() => openForm(agent)}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 dark:text-black py-2 rounded-lg text-sm">
            Inquiry
          </button>
</div>



{/* Add Review Section */}
<div className="mt-4 border-t pt-4">

  <h3 className="font-semibold mb-2">Add Review</h3>

  {/* Star rating */}
 <div className="flex gap-1 mb-2">
  {[1, 2, 3, 4, 5].map((num) => (
    <span
      key={num}
      onClick={() =>
        setNewReview({
          ...newReview,
          [agent.id]: {
            rating: num,
            comment: newReview[agent.id]?.comment || "",
          },
        })
      }
      className={`cursor-pointer text-xl ${
        newReview[agent.id]?.rating >= num
          ? "text-yellow-400"
          : "text-gray-400"
      }`}
    >
      ★
    </span>
  ))}
</div>

  <textarea
  className="w-full border rounded-md p-2 text-sm"
  placeholder="Write your review..."
  value={newReview[agent.id]?.comment || ""}
  onChange={(e) =>
    setNewReview({
      ...newReview,
      [agent.id]: {
        rating: newReview[agent.id]?.rating || 0,
        comment: e.target.value,
      },
    })
  }
/>


  <button
    onClick={() => submitReview(agent.id)}
    className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2 w-full"
  >
    Submit Review
  </button>

  {/* Show Reviews */}
  <div className="mt-4">
    {(reviews[agent.id] || []).map((r, index) => (
      <div key={index} className="border p-2 rounded-md mb-2 bg-gray-50">
        <div className="flex text-yellow-400 text-sm">
          {"★".repeat(r.rating)}
        </div>
        <p className="text-sm">{r.comment}</p>
      </div>
    ))}
  </div>
</div>


            </div>
          </div>
        ))}
      </div>

      

      {/* ✅ Pagination Buttons */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-5 py-2 rounded-lg text-white ${
            currentPage === 1 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        {/* Page numbers */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`px-3 py-1 rounded-md ${
            currentPage === index + 1
              ? "bg-primary text-white"
              : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          {index + 1}
        </button>
      ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-5 py-2 rounded-lg text-white ${
            currentPage === totalPages ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
      
      {/* CTA Section */}
      <div className="mt-16 bg-blue-600 rounded-xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Team of Professional Agents</h2>
        <p className="text-blue-100 max-w-2xl mx-auto mb-8">
          Are you passionate about real estate? Join our team of professional agents and start your successful career today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Link
         to="/join-our-team"
         className="bg-transparent border-2 text-white border-white hover:bg-blue-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
      >
         Join Our Team
      </Link>

          
      <Link
        to="/contact-hr"
        className="bg-transparent border-2 text-white border-white hover:bg-blue-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
      >
        Contact HR
      </Link>
        </div>
      </div>


      {/* Inquiry Modal */}
    {showForm && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-900 w-[90%] max-w-md p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
        Inquiry to {selectedAgent?.name}
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        onChange={handleChange}
        className="w-full mb-3 px-3 py-2 border rounded-md"
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        onChange={handleChange}
        className="w-full mb-3 px-3 py-2 border rounded-md"
      />

      <textarea
        name="message"
        placeholder="Your Message"
        onChange={handleChange}
        className="w-full mb-3 px-3 py-2 border rounded-md"
      ></textarea>

      <div className="flex gap-3">
        <button
          onClick={sendInquiry}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
        >
          Send on WhatsApp
        </button>

        <button
          onClick={() => setShowForm(false)}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};


export default Agents;
