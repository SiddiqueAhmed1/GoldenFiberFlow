import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import LoadingSpinner from "../Components/LoadingSpinner";

const PublicRoutes = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoutes;
