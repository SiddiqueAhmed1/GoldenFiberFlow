import api from "../Api/api";

// get all consignments
export const getConsignments = async () => {
  const consginment = await api.get("/api/v1/getConsignment");

  return consginment.data.data;
};
