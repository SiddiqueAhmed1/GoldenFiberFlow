import api from "../Api/api";

// get user
export const getUser = async () => {
  try {
    const users = await api.get("/api/v1/user");
    if (!users.data) {
      return "Users not found";
    }
    return users.data.data;
  } catch (error) {
    const errorMessage = error.response.data.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

// create user
export const createUser = async (formData) => {
  try {
    const user = await api.post("/api/v1/user", formData);
    return user.data.data;
  } catch (error) {
    const errorMessage = error.response.data.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};

// delete user
export const deleteUser = async (id) => {
  try {
    const deleteItem = await api.delete(`/api/v1/user/${id}`);
    return deleteItem.data.data;
  } catch (error) {
    const errorMessage = error.response.data.message || "Something went wrong";
    throw new Error(errorMessage);
  }
};
