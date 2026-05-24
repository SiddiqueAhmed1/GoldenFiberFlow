import { Outlet, useLocation } from "react-router-dom";
import Header from "../Components/Header";

export const MainLayout = () => {
  const location = useLocation();

  // dashboard and admin use sidebar layout — no top header needed
  const hideHeader =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideHeader && <Header />}
      <Outlet />
    </>
  );
};
