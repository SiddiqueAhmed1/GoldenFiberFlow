import api from "../Api/api";

export const getCustomers = async () => {
  try {
    const res = await api.get("/api/v1/customer");
    return res.data.data;
  } catch (e) {
    throw new Error(e.response?.data?.message || "Something went wrong");
  }
};

export const createCustomer = async (d) => {
  try {
    const res = await api.post("/api/v1/customer", d);
    return res.data.data;
  } catch (e) {
    throw new Error(e.response?.data?.message || "Something went wrong");
  }
};

export const updateCustomer = async (id, d) => {
  try {
    const res = await api.patch(`/api/v1/customer/${id}`, d);
    return res.data.data;
  } catch (e) {
    throw new Error(e.response?.data?.message || "Something went wrong");
  }
};

export const deleteCustomer = async (id) => {
  try {
    const res = await api.delete(`/api/v1/customer/${id}`);
    return res.data;
  } catch (e) {
    throw new Error(e.response?.data?.message || "Something went wrong");
  }
};

export const bulkImportCustomers = async (customers) => {
  try {
    const res = await api.post("/api/v1/customer/bulk-import", { customers });
    return res.data;
  } catch (e) {
    throw new Error(e.response?.data?.message || "Something went wrong");
  }
};
