import React from "react";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <>
      <div className="max-h-screen">
        <Outlet />
      </div>
    </>
  );
};
