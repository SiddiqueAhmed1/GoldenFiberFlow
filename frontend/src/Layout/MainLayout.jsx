import { Outlet } from "react-router-dom";
import Header from "../Components/Header";

export const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
