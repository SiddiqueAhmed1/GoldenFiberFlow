import axios from "axios";
import toast from "react-hot-toast";

console.log("API URL:", import.meta.env.VITE_API_URL);

// create cusome axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      window.location.href = "/login";
    }
    if (!error.response) {
      toast.error("Network error — backend unreachable");
    }
    if (error.response.status === 500) {
      alert("server error");
    }
    return Promise.reject(error);
  },
);

export default api;
