import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <>
      <section>
        <div>
          <div>Consignment</div>
          <div>
            <NavLink to={"/dashboard"}>Dashboard</NavLink>
          </div>
          <div>
            <NavLink to={"/admin"}>Admin</NavLink>
          </div>
          <div>
            <button>Logout</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;
