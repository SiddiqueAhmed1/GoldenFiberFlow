import "@fontsource/inter";
import "@fontsource/poppins";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import Header from "./Components/Header";

const App = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Toaster />
    </>
  );
};

export default App;
