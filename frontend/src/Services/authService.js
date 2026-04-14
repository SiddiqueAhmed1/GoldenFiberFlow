import toast from "react-hot-toast";
import api from "../Api/api";
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
    localStorage.setItem("user", JSON.stringify(res.data.data));
    localStorage.setItem("accessToken", res.data.accessToken);
    toast.success("Login Succesfull");
    return res.data;
  } catch (error) {
    return toast.error(error || error.message);
  }
};
