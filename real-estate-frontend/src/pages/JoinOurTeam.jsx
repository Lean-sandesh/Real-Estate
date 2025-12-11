import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin, FiClock, FiArrowLeft  } from "react-icons/fi";



export default function JoinOurTeam() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    experience: "",
    message: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // WhatsApp HR Number 
  const hrNumber = "+91 9166575790";

  const handleSubmit = (e) => {
    e.preventDefault();

    // WhatsApp Message Formatting
    const whatsappMessage = `
Job Application

Name: ${formData.name}
Mobile: ${formData.mobile}
Email: ${formData.email}
City: ${formData.city}
Experience: ${formData.experience}
Message: ${formData.message || "No message"}

Resume: (Attached Separately)
    `;

    const encoded = encodeURIComponent(whatsappMessage);

    const url = `https://wa.me/${hrNumber}?text=${encoded}`;

    window.open(url, "_blank"); 
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10 mb-20">
          {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 mb-4 hover:text-black"
      >
        <FiArrowLeft size={20} /> Go Back
      </button>
      <h1 className="text-3xl font-bold text-center mb-6">Join Our Team</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="city"
          placeholder="Current City"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        />

        <select
          name="experience"
          className="w-full p-3 border rounded"
          onChange={handleChange}
          required
        >
          <option value="">Select Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="1-2 Years">1-2 Years</option>
          <option value="2-4 Years">2-4 Years</option>
          <option value="5+ Years">5+ Years</option>
        </select>

        <textarea
          name="message"
          placeholder="Message (Optional)"
          className="w-full p-3 border rounded h-24"
          onChange={handleChange}
        ></textarea>

        <div>
          <label className="font-semibold">Upload Resume (PDF Only)</label>
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            className="w-full p-3 border rounded"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700"
        >
          Send Application on WhatsApp
        </button>
      </form>
    </div>
  );
}
