import { createBrowserRouter } from "react-router-dom";
import { Login } from "../Pages/Login";
import App from "../App";

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
    ],
  },
]);

export default router;
