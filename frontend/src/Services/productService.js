import api from "../Api/api";

export const getProducts = async () => {
  try {
    const res = await api.get("/api/v1/product");
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const createProduct = async (formData) => {
  try {
    const res = await api.post("/api/v1/product", formData);
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const res = await api.patch(`/api/v1/product/${id}`, formData);
    return res.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/api/v1/product/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

export const bulkImportProducts = async (products) => {
  try {
    const res = await api.post("/api/v1/bulk-import", { products });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};
