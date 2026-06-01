import { createBrowserRouter } from "react-router-dom";
import { Login } from "../Pages/Login";
import { Register } from "../Pages/Register";
import { Dashboard } from "../Pages/Dashboard";
import { MainLayout } from "../Layout/MainLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import Admin from "../Pages/Admin";
import IndexRedirect from "./IndexRedirect";
import { DashboardLayout } from "../Layout/DashboardLayout";
import Pdf from "../Pages/Pdf";
import Suppliers from "../Pages/Suppliers";
import Drivers from "../Pages/Drivers";
import Vehicles from "../Pages/Vehicles";
import Warehouses from "../Pages/Warehouses";
import DashboardHome from "../Pages/DashboardHome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <IndexRedirect /> },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardHome /> },
              { path: "consignments", element: <Dashboard /> },
              { path: "consignment/:id", element: <Pdf /> },
              { path: "suppliers", element: <Suppliers /> },
              { path: "drivers", element: <Drivers /> },
              { path: "vehicles", element: <Vehicles /> },
              { path: "warehouses", element: <Warehouses /> },
              { path: "admin", element: <Admin /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <PublicRoutes />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

export default router;
