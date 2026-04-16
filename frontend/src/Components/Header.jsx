import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Box, LogOut } from "lucide-react";
import { FaBars, FaRegTimesCircle, FaUser } from "react-icons/fa";
import logo from "../assets/gftcl.png";
import { useState } from "react";

const Header = () => {
  const { setUser, user } = useAuth();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);

  const navItems = [{ name: "Dashboard", path: "/dashboard", icon: <Box /> }];

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
  };
  return (
    <>
      <header className="bg-white w-full ">
        <div className="shadow">
          <div className=" flex max-w-360 justify-between items-center p-4 mx-auto">
            {/* header for desktop */}
            <Link to={"/dashboard"} className="flex gap-2 items-center">
              <img height={60} width={60} src={logo} alt="GFTCL" />
            </Link>

            {/* desktop navItem */}
            <div className="md:flex gap-5 hidden">
              {navItems.map((item, index) => {
                return (
                  <Link
                    key={index}
                    className={`text-lg text-neutral-700 p-3 flex items-center gap-2 ${location.pathname === item.path ? "bg-blue-600 text-white rounded-md " : "hover:bg-gray-200 rounded-md transition-all"}`}
                    to={item.path}
                  >
                    {item.icon} {item.name}
                  </Link>
                );
              })}

              {user?.role === "Admin" && (
                <Link
                  className={`text-lg text-neutral-700 p-3 flex items-center gap-2 ${location.pathname === "/admin" ? "bg-blue-600 text-white rounded-md " : "hover:bg-gray-200 rounded-md transition-all"}`}
                  to={"/admin"}
                >
                  <FaUser /> Admin Panel
                </Link>
              )}
            </div>

            {/* desktop right part */}
            <div className="md:flex hidden gap-3 justify-center items-center">
              <div className="flex flex-col justify-center items-end">
                <h1 className="text-sm text-neutral-900 font-semibold">
                  {user?.name}
                </h1>
                <p className="text-sm text-neutral-500">{user?.role}</p>
              </div>
              <button
                className="border-gray-500 flex gap-2 cursor-pointer hover:bg-neutral-50  border px-3 py-3 text-black font-semibold rounded-md"
                onClick={handleLogOut}
              >
                <LogOut size={22} /> Logout
              </button>
            </div>

            {/* mobile humberger */}
            <div
              className="md:hidden"
              onClick={() => setMobileMenu((prev) => !prev)}
            >
              {mobileMenu ? (
                <FaRegTimesCircle size={28} />
              ) : (
                <FaBars size={28} />
              )}
            </div>
          </div>
        </div>
        {mobileMenu && (
          <div className="flex gap-5">
            {navItems.map((item) => {
              return (
                <Link
                  className={`text-lg block text-neutral-700 p-3 ${location.pathname === item.path ? "bg-amber-600 text-white rounded-md " : ""}`}
                  to={item.path}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
