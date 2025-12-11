import React, { useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import { FiUploadCloud, FiHome, FiMapPin } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

const AddProperty = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    type: "sale",
    category: "residential",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ------------------ SUBMIT ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Image required
    if (!image) {
      toast.error("Please upload a property image!");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();

      // BASIC FIELDS
      data.append("title", form.title);
      data.append("price", form.price);
      data.append("description", form.description);
      data.append("type", form.type);
      data.append("category", form.category);

      // LOCATION (NESTED)
      data.append("location[address]", form.address);
      data.append("location[city]", form.city);
      data.append("location[state]", form.state);
      data.append("location[zipCode]", form.zipCode);

      // SPECIFICATIONS (NESTED)
      data.append("specifications[bedrooms]", form.bedrooms);
      data.append("specifications[bathrooms]", form.bathrooms);
      data.append("specifications[area]", form.area);

      // IMAGE (correct key)
      data.append("images", image);

      await api.post("/api/properties", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Property submitted for approval!");

      // Reset
      setForm({
        title: "",
        price: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        description: "",
        type: "sale",
        category: "residential",
      });

      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  // ------------------- UI ---------------------
  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl border p-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Add New Property
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          placeholder="Property Title"
          required
        />

        {/* Price */}
        <div className="flex items-center border rounded-lg p-3">
          <FaRupeeSign className="text-green-600 mr-2" />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full outline-none"
            placeholder="Price"
            required
          />
        </div>

        {/* Location */}
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          placeholder="Address"
          required
        />

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          placeholder="City"
          required
        />

        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          placeholder="State"
          required
        />

        <input
          name="zipCode"
          value={form.zipCode}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          placeholder="ZIP Code"
          required
        />

        {/* Specifications */}
        <div className="grid grid-cols-3 gap-4">
          <input
            name="bedrooms"
            value={form.bedrooms}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            placeholder="Bedrooms"
            required
          />
          <input
            name="bathrooms"
            value={form.bathrooms}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            placeholder="Bathrooms"
            required
          />
          <input
            name="area"
            value={form.area}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            placeholder="Area (sqft)"
            required
          />
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          rows="4"
          placeholder="Description"
          required
        />

        {/* Image Upload */}
        <div className="border-2 border-dashed p-6">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        {preview && (
          <img src={preview} className="mt-3 w-full h-48 object-cover rounded-lg" />
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
        >
          {loading ? "Adding..." : "Add Property"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
