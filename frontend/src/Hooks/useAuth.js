import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
