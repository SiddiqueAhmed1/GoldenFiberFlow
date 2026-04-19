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

// create consignments
export const createConsignments = async (
  sender_details,
  receiver_details,
  item,
  status,
) => {
  try {
    const inputData = {
      sender_details,
      receiver_details,
      item,
      status,
    };

    const res = await api.post("/api/v1/createConsignment", inputData);
    console.log("create cons", res?.data);

    return res?.data?.data;
  } catch (error) {
    console.log("error from cons", error || error.message);
    throw new Error(error);
  }
};
