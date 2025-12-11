import React, { useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";

const AdminAddProperty = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "sale",
    category: "residential",

    // Location
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Specifications
    bedrooms: "",
    bathrooms: "",
    area: "",
    areaUnit: "sqft",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Multiple image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  // Submit property
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // Basic fields
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("type", form.type);
      data.append("category", form.category);
      data.append("price", form.price);

      // Location object
      data.append("location[address]", form.address);
      data.append("location[city]", form.city);
      data.append("location[state]", form.state);
      data.append("location[zipCode]", form.zipCode);

      // Specifications object
      data.append("specifications[bedrooms]", form.bedrooms);
      data.append("specifications[bathrooms]", form.bathrooms);
      data.append("specifications[area]", form.area);
      data.append("specifications[areaUnit]", form.areaUnit);

      // Attach all images
      images.forEach((img) => {
        data.append("images", img);
      });

      await api.post("/api/properties", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Property added successfully!");

      // Reset
      setForm({
        title: "",
        description: "",
        price: "",
        type: "sale",
        category: "residential",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        areaUnit: "sqft",
      });

      setImages([]);
      setPreview([]);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-8 rounded-xl mt-10">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        🏡 Add New Property
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Title */}
        <input
          name="title"
          placeholder="Property Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          rows="3"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        {/* Price */}
        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        {/* Type */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
          <option value="pre-launch">Pre Launch</option>
        </select>

        {/* Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
          <option value="industrial">Industrial</option>
          <option value="project">Project</option>
          <option value="new-launch">New Launch</option>
        </select>

        {/* LOCATION */}
        <h3 className="text-lg font-semibold mt-4">📍 Location Details</h3>

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="zipCode"
          placeholder="ZIP Code"
          value={form.zipCode}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        {/* SPECIFICATIONS */}
        <h3 className="text-lg font-semibold mt-4">📏 Specifications</h3>

        <input
          name="bedrooms"
          placeholder="Bedrooms"
          value={form.bedrooms}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="bathrooms"
          placeholder="Bathrooms"
          value={form.bathrooms}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="area"
          placeholder="Area"
          value={form.area}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <select
          name="areaUnit"
          value={form.areaUnit}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="sqft">Sqft</option>
          <option value="sqm">Sqm</option>
        </select>

        {/* IMAGES */}
        <h3 className="text-lg font-semibold mt-4">🖼 Upload Property Images</h3>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border p-3 rounded"
        />

        {/* Preview */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          {preview.map((img, idx) => (
            <img
              key={idx}
              src={img}
              className="h-28 w-full object-cover rounded shadow"
            />
          ))}
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 mt-5 rounded"
        >
          {loading ? "Adding..." : "Add Property"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddProperty;
