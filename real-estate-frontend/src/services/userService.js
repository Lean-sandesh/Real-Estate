import api from "./api"; // your axios instance

const updateProfile = async (formData) => {
  return await api.put("/auth/update-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default {
  updateProfile,
};
