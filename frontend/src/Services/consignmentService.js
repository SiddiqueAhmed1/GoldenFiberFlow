import api from "../Api/api";
import Swal from "sweetalert2";

// get all consignments FIXME:
export const getConsignments = async () => {
  try {
    const consginment = await api.get("/api/v1/getConsignment");
    if (!consginment) {
      throw new Error("Consignment not found");
    }

    return consginment.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

// create consignments TODO:
export const createConsignments = async (
  sender_details,
  receiver_details,
  transportation_details,
  items,
  status,
) => {
  try {
    const inputData = {
      sender_details,
      transportation_details,
      receiver_details,
      items,
      status,
    };

    const res = await api.post("/api/v1/createConsignment", inputData);

    return res?.data?.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

// update consignments FIXME:
export const updateConsignments = async (id, formData) => {
  try {
    const res = await api.patch(`/api/v1/updateConsignment/${id}`, formData);

    return res?.data?.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

// consignment delte TODO:
export const deleteConsignment = async (id) => {
  try {
    const deletedItem = await api.delete(`/api/v1/deleteConsignment/${id}`);
    if (!deletedItem) {
      throw new Error("Consginment not delete");
    }
    return deletedItem.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

// get single consignment FIXME:
export const getSingleConsignment = async (id) => {
  try {
    const singleConsignment = await api.get(`/api/v1/singleConsignment/${id}`);
    return singleConsignment.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};
