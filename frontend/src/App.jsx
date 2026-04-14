import "@fontsource/inter";
import "@fontsource/poppins";
import { useAuth } from "./hooks/useAuth";
import { Navigate } from "react-router-dom";

const App = () => {
  const { user } = useAuth();

  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default App;
