import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Menu } from "lucide-react";

export const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden transition-colors duration-300">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700/60 sticky top-0 z-30 transition-colors duration-300">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 cursor-pointer transition"
          >
            <Menu size={20} />
          </button>
          <p className="text-sm font-bold text-neutral-800 dark:text-white">
            GoldenFiber{" "}
            <span className="text-amber-500 font-semibold">Flow</span>
          </p>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
