import { createBrowserRouter } from "react-router-dom";
import { Login }          from "../Pages/Login";
import { Register }       from "../Pages/Register";
import { MainLayout }     from "../Layout/MainLayout";
import ProtectedRoutes    from "./ProtectedRoutes";
import PublicRoutes       from "./PublicRoutes";
import Admin              from "../Pages/Admin";
import IndexRedirect      from "./IndexRedirect";
import { DashboardLayout } from "../Layout/DashboardLayout";
import DashboardHome      from "../Pages/DashboardHome";
import Suppliers          from "../Pages/Suppliers";
import Products           from "../Pages/Products";
import Drivers            from "../Pages/Drivers";
import Vehicles           from "../Pages/Vehicles";
import Warehouses         from "../Pages/Warehouses";
import Customers          from "../Pages/Customers";
import SalesOrders        from "../Pages/SalesOrders";
import PurchaseOrders     from "../Pages/PurchaseOrders";
import Inventory          from "../Pages/Inventory";
import Invoices           from "../Pages/Invoices";

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
              { index: true,                      element: <DashboardHome />   },
              { path: "customers",                element: <Customers />       },
              { path: "suppliers",                element: <Suppliers />       },
              { path: "products",                 element: <Products />        },
              { path: "inventory",                element: <Inventory />       },
              { path: "sales-orders",             element: <SalesOrders />     },
              { path: "purchase-orders",          element: <PurchaseOrders />  },
              { path: "invoices",                 element: <Invoices />        },
              { path: "drivers",                  element: <Drivers />         },
              { path: "vehicles",                 element: <Vehicles />        },
              { path: "warehouses",               element: <Warehouses />      },
              { path: "admin",                    element: <Admin />           },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <PublicRoutes />,
    children: [
      { path: "login",    element: <Login />    },
      { path: "register", element: <Register /> },
    ],
  },
]);
export default router;
