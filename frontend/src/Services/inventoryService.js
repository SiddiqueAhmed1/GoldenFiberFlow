import api from "../Api/api";
export const getInventory = async () => {
  try {
    const res = await api.get("/api/v1/inventory");
    return res.data.data;
  } catch (e) {
    throw new Error(e.response?.data?.message || "Something went wrong");
  }
};
export const adjustInventory = async (d) => {
  try {
    const res = await api.patch("/api/v1/inventory/adjust", d);
    return res.data.data;
  } catch (e) {
    throw new Error(e.response?.data?.message || "Something went wrong");
  }
};
