import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/gftcl.png";

const Header = () => {
  const { setUser } = useAuth();
  const location = useLocation();

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
  };
  return (
    <>
      <section className="shadow p-4">
        <div className="flex justify-between items-center w-[350px] md:w-[600px] lg:w-[1600px] m-auto">
          <Link to={"/dashboard"}>
            <img height={60} width={60} src={logo} alt="GFTCL" />
          </Link>
          <div className="flex gap-5">
            <NavLink
              className={`text-lg text-neutral-700 p-3 ${location.pathname === "/dashboard" ? "bg-amber-600 text-white rounded-md " : ""}`}
              to={"/dashboard"}
            >
              Dashboard
            </NavLink>
            <NavLink
              className={`text-lg text-neutral-700 p-3 ${location.pathname === "/admin" ? "bg-amber-600 text-white rounded-md" : ""}`}
              to={"/admin"}
            >
              Admin
            </NavLink>
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
      </section>
    </>
  );
};

export default Header;
