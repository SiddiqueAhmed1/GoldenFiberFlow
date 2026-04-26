import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import LoadingSpinner from "../Components/LoadingSpinner";

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
