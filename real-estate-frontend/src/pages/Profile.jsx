import { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiSave, FiEdit } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import { useNavigate } from "react-router-dom";


export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();


  const [photo, setPhoto] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      country: user?.address?.country || "",
    });


    const img =
      user?.image ||
      user?.profileImage ||
      user?.avatar ||
      user?.photo ||
      null;

    setPhoto(img);
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
      setImageError(false);
    }
  };

  const handleImgError = () => setImageError(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);

    //  send address as nested object
    formData.append("address[city]", form.city);
    formData.append("address[state]", form.state);
    formData.append("address[country]", form.country);

    if (imageFile) formData.append("avatar", imageFile);


    try {
      const res = await userService.updateProfile(formData);

      updateUser(res.data.user); // update global user in AuthContext

      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-md"
      >
        <span className="text-lg">←</span>
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
              {photo && !imageError ? (
                <img
                  src={photo}
                  alt="Avatar"
                  onError={handleImgError}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <FiUser className="text-3xl text-gray-600 dark:text-gray-300" />
              )}
            </div>

            {editMode && (
              <>
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full border-2 border-white cursor-pointer hover:bg-blue-700"
                >
                  <FiCamera className="text-white text-sm" />
                </label>

                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </>
            )}
          </div>

          <div>
            {!editMode ? (
              <>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {user?.role === "agent" ? "Verified Agent" : "Premium Member"}
                </p>
              </>
            ) : (
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-3">
            <FiMail className="text-gray-500" />
            {!editMode ? (
              <p>{user?.email}</p>
            ) : (
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <FiPhone className="text-gray-500" />
            {!editMode ? (
              <p>{user?.phone || "Not provided"}</p>
            ) : (
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            )}
          </div>

          {/* City State Country */}
          <div className="flex items-center gap-3">
            <FiMapPin className="text-gray-500" />
            {!editMode ? (
              <p>
                {user?.address?.city}, {user?.address?.state}, {user?.address?.country}
              </p>

            ) : (
              <div className="grid grid-cols-3 gap-3 w-full">
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="City"
                />
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="State"
                />
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  placeholder="Country"
                />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <FiEdit /> Edit Profile
          </button>
        ) : (
          <button
            onClick={saveProfile}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <FiSave /> Save Changes
          </button>
        )}
      </div>
    </div>
  );
}
