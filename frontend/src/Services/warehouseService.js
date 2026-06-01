import api from "../Api/api";

export const getWarehouses = async () => {
  try {
    const res = await api.get("/api/v1/warehouse");
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const createWarehouse = async (formData) => {
  try {
    const res = await api.post("/api/v1/warehouse", formData);
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const updateWarehouse = async (id, formData) => {
  try {
    const res = await api.patch(`/api/v1/warehouse/${id}`, formData);
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const deleteWarehouse = async (id) => {
  try {
    const res = await api.delete(`/api/v1/warehouse/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};
