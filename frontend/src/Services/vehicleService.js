import api from "../Api/api";

export const getVehicles = async () => {
  try {
    const res = await api.get("/api/v1/vehicle");
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const createVehicle = async (formData) => {
  try {
    const res = await api.post("/api/v1/vehicle", formData);
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const updateVehicle = async (id, formData) => {
  try {
    const res = await api.patch(`/api/v1/vehicle/${id}`, formData);
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const deleteVehicle = async (id) => {
  try {
    const res = await api.delete(`/api/v1/vehicle/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};
