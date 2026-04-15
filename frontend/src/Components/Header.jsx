import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Box, LogOut } from "lucide-react";
import { FaBars, FaRegTimesCircle, FaUser } from "react-icons/fa";
import logo from "../assets/gftcl.png";
import { useState } from "react";

const Header = () => {
  const { setUser } = useAuth();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Box /> },
    { name: "Admin", path: "/admin", icon: <FaUser /> },
  ];

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
  };
  return (
    <>
      <section className="shadow p-4">
        {/* header for desktop */}
        <div className="hidden md:flex lg:flex justify-between items-center lg:w-[1600px] m-auto">
          <Link to={"/dashboard"}>
            <img height={60} width={60} src={logo} alt="GFTCL" />
          </Link>

          <div className="flex gap-5">
            {navItems.map((item) => {
              return (
                <Link
                  className={`text-lg text-neutral-700 p-3 flex items-center gap-2 ${location.pathname === item.path ? "bg-blue-600 text-white rounded-md " : "hover:bg-gray-200 rounded-md transition-all"}`}
                  to={item.path}
                >
                  {item.icon} {item.name}
                </Link>
              );
            })}
          </div>

          <div>
            <button
              className="border-gray-500 flex gap-2 cursor-pointer hover:bg-neutral-50  border px-3 py-3 text-black font-semibold rounded-md"
              onClick={handleLogOut}
            >
              <LogOut size={22} /> Logout
            </button>
          </div>
        </div>

        {/* header for mobile */}
        <div className="md:hidden lg:hidden w-[350px] md:w-[650px] flex justify-between mx-auto items-center">
          <div>
            <Link onClick={() => setMobileMenu(false)} to={"/dashboard"}>
              <img height={40} width={40} src={logo} alt="GFTCL" />
            </Link>
          </div>

          {/* mobile humberger */}
          <div onClick={() => setMobileMenu((prev) => !prev)}>
            {mobileMenu ? <FaRegTimesCircle size={28} /> : <FaBars size={28} />}
          </div>

          {/* mobile menu */}
        </div>
      </section>
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
    </>
  );
};

export default Header;
