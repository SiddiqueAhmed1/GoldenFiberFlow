import api from "../Api/api";

export const getDrivers = async () => {
  try {
    const res = await api.get("/api/v1/driver");
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const createDriver = async (formData) => {
  try {
    const res = await api.post("/api/v1/driver", formData);
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const updateDriver = async (id, formData) => {
  try {
    const res = await api.patch(`/api/v1/driver/${id}`, formData);
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const deleteDriver = async (id) => {
  try {
    const res = await api.delete(`/api/v1/driver/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};
