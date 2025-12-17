import api from "./api";

export const updateProfile = (data) => {
  return api.put("/auth/profile", data);
};

export const updateLocation = (data) => {
  return api.put("/auth/update-location", data);
};

export default {
  updateProfile,
  updateLocation,
};
