import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaBars, FaRegTimesCircle } from "react-icons/fa";
import logo from "../assets/gftcl.png";
import { useState } from "react";

const Header = () => {
  const { setUser } = useAuth();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Admin", path: "/admin" },
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
                  className={`text-lg text-neutral-700 p-3 ${location.pathname === item.path ? "bg-amber-600 text-white rounded-md " : ""}`}
                  to={item.path}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div>
            <button
              className="bg-amber-500 px-3 py-3 text-neutral-100 rounded-md"
              onClick={handleLogOut}
            >
              Logout
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
