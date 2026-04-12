import { createBrowserRouter } from "react-router-dom";
import { Login } from "../Pages/Login";
import App from "../App";
import { Register } from "../Pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
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
