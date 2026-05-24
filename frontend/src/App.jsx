import router from "./Routing/Index";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { ThemeProvider } from "./Context/ThemeContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
