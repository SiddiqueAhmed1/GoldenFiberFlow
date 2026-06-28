import api from "../Api/api";

// get all suppliers
export const getSuppliers = async () => {
  try {
    const res = await api.get("/api/v1/supplier");
    return res.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

// create supplier
export const createSupplier = async (formData) => {
  try {
    const res = await api.post("/api/v1/supplier", formData);
    return res.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

// update supplier
export const updateSupplier = async (id, formData) => {
  try {
    const res = await api.patch(`/api/v1/supplier/${id}`, formData);
    return res.data.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

// delete supplier
export const deleteSupplier = async (id) => {
  try {
    const res = await api.delete(`/api/v1/supplier/${id}`);
    return res.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

/**
 * Service function to upload excel file for bulk supplier import
 * @param {FormData} fileData - The form data containing the excel file
 * @returns {Promise<Object>} API response data
 */
export const uploadSupplierExcel = async (fileData) => {
  try {
    // Using your custom 'api' instance and matching your '/api/v1/supplier' path format
    const res = await api.post("/api/v1/supplier/upload-excel", fileData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};
