import toast from "react-hot-toast";
import api from "../utils/api";
// login user
export const login = async (email, password) => {
  try {
    // input data
    const loginData = {
      email,
      password,
    };

    // login
    const res = await api.post("/api/v1/login", loginData);

    if (!res.data) {
      return toast.error("data not found");
    }
    toast.success("Login Succesfull");
    return res.data;
  } catch (error) {
    return toast.error(error || error.message);
  }
};
