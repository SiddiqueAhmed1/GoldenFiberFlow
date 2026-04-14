import router from "./Routing/Index";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </>
  );
};

export default App;
