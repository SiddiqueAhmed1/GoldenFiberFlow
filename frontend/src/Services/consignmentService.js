import api from "../Api/api";

// get all consignments
export const getConsignments = async () => {
  try {
    const consginment = await api.get("/api/v1/getConsignment");

    return consginment.data.data;
  } catch (error) {
    throw new Error(error || error.message);
  }
};
