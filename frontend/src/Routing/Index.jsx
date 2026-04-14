import { createBrowserRouter } from "react-router-dom";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { Dashboard } from "../Pages/Dashboard";
import { MainLayout } from "../Layout/MainLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import Admin from "../Pages/Admin";
import IndexRedirect from "./IndexRedirect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    // with credentials private route
    children: [
      {
        path: "/",
        element: <IndexRedirect />,
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/admin",
            element: <Admin />,
          },
        ],
      },
    ],
  },

  // without credentials public route
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
