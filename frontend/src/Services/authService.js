import api from "../Api/api";

// login user
export const login = async (email, password) => {
  // input data
  const loginData = {
    email,
    password,
  };

  // login
  const res = await api.post("/api/v1/login", loginData);

  if (!res.data) {
    throw new Error("User not found");
  }
  localStorage.setItem("user", JSON.stringify(res.data.data));
  localStorage.setItem("accessToken", res.data.accessToken);
  return res.data.data;
};

// isAdmin
export const isAdmin = ({ role }) => {
  if (role !== "Admin") return false;
  return true;
};
