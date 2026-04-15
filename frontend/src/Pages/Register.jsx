import { NavLink } from "react-router-dom";
import logo from "../assets/gftcl.png";

export const Register = () => {
  return (
    <>
      <section className="flex items-center justify-center h-screen bg-blue-50">
        <div className=" shadow-md drop-shadow-lg shadow-amber-500/10 bg-white rounded-2xl border border-amber-50 w-85 h-140 lg:w-[550px] lg:h-[650px] m-auto px-6 pt-6 lg:px-9 lg:pt-9">
          {/* login-metadata */}
          <div className=" flex flex-col justify-center items-center gap-1">
            <img
              className="mb-3"
              height={70}
              width={70}
              src={logo}
              alt="GFTCL"
            />
            <h1 className="text-lg lg:text-2xl font-semibold">
              Create an Account
            </h1>
            <p className="text-center lg:w-full w-40 text-sm lg:text-lg text-neutral-600 font-medium">
              Enter your information to get started
            </p>
          </div>

          {/* login form */}
          <div className="my-4 lg:my-6">
            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="fullName">Full Name</label>
                <input
                  className="focus-within:outline-amber-500 focus-within:outline-2 h-11 lg:h-[52px] w-full rounded-lg border outline-0 border-neutral-300 px-3 lg:text-lg text-sm"
                  id="fullName"
                  type="text"
                  placeholder="Enter full name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="Email">Email</label>
                <input
                  className="focus-within:outline-amber-500 focus-within:outline-2 h-11 lg:h-[52px] w-full rounded-lg border outline-0 border-neutral-300 px-3 lg:text-lg text-sm"
                  id="Email"
                  type="text"
                  placeholder="admin@example.com"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="password">Password</label>
                <input
                  className="focus-within:outline-amber-500 focus-within:outline-2 h-11 lg:h-[52px] w-full rounded-lg border outline-0 border-neutral-300 px-3 lg:text-lg text-sm"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex flex-col lg:mt-2">
                <button
                  type="submit"
                  className="bg-blue-600 py-2 lg:py-3 text-sm lg:text-lg rounded-lg text-white lg:font-semibold cursor-pointer hover:bg-blue-500 transition-all"
                >
                  Register
                </button>
              </div>
            </form>
          </div>

          {/* form footer */}
          <div className="flex lg:justify-end justify-center ">
            <p className="lg:text-sm text-xs">
              Already have account?{" "}
              <NavLink
                className="text-blue-500 font-semibold hover:underline"
                to={"/login"}
              >
                Login here
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
