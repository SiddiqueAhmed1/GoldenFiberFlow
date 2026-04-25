import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

const IndexRedirect = () => {
  const { user } = useAuth();

  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default IndexRedirect;
