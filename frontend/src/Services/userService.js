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
    throw new Error(error || error.message);
  }
};

// create user
export const createUser = async (formData) => {
  const user = await api.post("/api/v1/user", formData);
  return user.data.data;
};

// delete user
export const deleteUser = async (id) => {
  const deleteItem = await api.delete(`/api/v1/user/${id}`);
  console.log("deleteItem.data", deleteItem.data);

  return deleteItem.data.data;
};
