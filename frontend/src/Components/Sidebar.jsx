import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import { useTheme } from "../Context/ThemeContext";
import logo from "../assets/gftcl.png";
import {
  LayoutDashboard,
  Package,
  Building2,
  BoxIcon,
  Truck,
  Car,
  Warehouse,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Sun,
  Moon,
} from "lucide-react";

const navGroups = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Consignments", path: "/dashboard/consignments", icon: Package },
      { name: "Suppliers", path: "/dashboard/suppliers", icon: Building2 },
      { name: "Products", path: "/dashboard/products", icon: BoxIcon },
    ],
  },
  {
    label: "Logistics",
    items: [
      { name: "Drivers", path: "/dashboard/drivers", icon: Truck },
      { name: "Vehicles", path: "/dashboard/vehicles", icon: Car },
      { name: "Warehouses", path: "/dashboard/warehouses", icon: Warehouse },
    ],
  },
  {
    label: "Admin",
    adminOnly: true,
    items: [{ name: "Users", path: "/dashboard/admin", icon: Users }],
  },
];

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, setUser } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  // avatar initials
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* ── Logo bar ── */}
      <div
        className={`flex items-center border-b border-neutral-200 dark:border-neutral-700/60 transition-all duration-300 ${collapsed ? "justify-center px-0 py-4" : "justify-between px-4 py-4"}`}
      >
        {/* Logo always visible — scales cleanly when collapsed */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3 min-w-0 overflow-hidden"
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-md">
            <img
              src={logo}
              alt="GFTCL"
              className="w-7 h-7 object-contain rounded-lg"
            />
          </div>
          <div
            className={`min-w-0 overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
          >
            <p className="text-sm font-bold text-neutral-800 dark:text-white truncate leading-tight whitespace-nowrap">
              GoldenFiber
            </p>
            <p className="text-[11px] text-amber-500 dark:text-amber-400 font-semibold truncate leading-tight whitespace-nowrap">
              Flow
            </p>
          </div>
        </Link>

        {/* Collapse toggle — desktop */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer transition flex-shrink-0 ml-2"
          >
            <ChevronLeft size={15} />
          </button>
        )}

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden flex items-center justify-center w-7 h-7 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 cursor-pointer flex-shrink-0"
        >
          <X size={15} />
        </button>
      </div>

      {/* Expand button — shown only when collapsed on desktop */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="hidden md:flex mt-3 mx-auto items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer transition"
        >
          <ChevronRight size={15} />
        </button>
      )}

      {/* ── Nav groups ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
        {navGroups.map((group) => {
          if (group.adminOnly && user?.role !== "Admin") return null;
          return (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 px-3 mb-2">
                  {group.label}
                </p>
              )}
              {collapsed && (
                <div className="border-t border-neutral-200 dark:border-neutral-700/50 my-2 mx-1" />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.name : undefined}
                      className={`flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150 group
                        ${collapsed ? "justify-center px-0 py-2.5 mx-1" : "px-3 py-2.5"}
                        ${
                          active
                            ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-200 dark:shadow-amber-900/40"
                            : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 hover:text-neutral-800 dark:hover:text-neutral-100"
                        }`}
                    >
                      <Icon
                        size={18}
                        className={`flex-shrink-0 transition-transform duration-150 ${active ? "" : "group-hover:scale-110"}`}
                      />
                      {!collapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                      {!collapsed && active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── Bottom: theme toggle + user ── */}
      <div className="border-t border-neutral-200 dark:border-neutral-700/60 px-2 py-3 space-y-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
          className={`flex items-center gap-3 w-full rounded-xl text-sm font-medium transition-all duration-150
            text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 hover:text-neutral-800 dark:hover:text-neutral-100
            ${collapsed ? "justify-center px-0 py-2.5 mx-1" : "px-3 py-2.5"}`}
        >
          {dark ? (
            <Sun size={18} className="flex-shrink-0 text-amber-400" />
          ) : (
            <Moon size={18} className="flex-shrink-0" />
          )}
          {!collapsed && <span>{dark ? "Light mode" : "Dark mode"}</span>}
        </button>

        {/* User card */}
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-700/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate leading-tight">
                  {user?.name}
                </p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-neutral-400 hover:text-red-500 cursor-pointer transition"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex w-full justify-center py-2.5 mx-1 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 cursor-pointer transition"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700/60 h-screen sticky top-0 transition-all duration-300 flex-shrink-0 overflow-hidden ${
          collapsed ? "w-[68px]" : "w-56"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700/60 z-50 flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
