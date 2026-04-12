import { ToastContainer } from "react-toastify";
import "@fontsource/inter";
import "@fontsource/poppins";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, []);

  return (
    <>
      <ToastContainer />
    </>
  );
};

export default App;
