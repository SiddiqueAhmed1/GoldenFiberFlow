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
