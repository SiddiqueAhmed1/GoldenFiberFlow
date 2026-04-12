import { NavLink } from "react-router-dom";
import logo from "../../public/gftcl.png";

export const Login = () => {
  return (
    <>
      <section className="flex items-center justify-center h-screen bg-blue-50">
        <div className=" shadow-md drop-shadow-lg shadow-amber-500/10 bg-white rounded-2xl border border-amber-50 w-85 h-150 lg:w-[500px] lg:h-[700px] m-auto px-6 pt-5 lg:px-9  lg:py-11">
          {/* loing-metadata */}
          <div className=" flex flex-col justify-center items-center gap-1">
            <img
              className="mb-3"
              height={70}
              width={70}
              src={logo}
              alt="GFTCL"
            />
            <h1 className="">Welcome Back</h1>
            <p className="text-center lg:w-full w-40 text-sm lg:text-lg text-neutral-600 font-medium">
              Enter your credentials to access your account
            </p>
          </div>

          {/* login form */}
          <div className="my-4 lg:my-6">
            <form className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="email">Email</label>
                <input
                  className="focus-within:outline-amber-500 focus-within:outline-2 h-11 lg:h-[52px] w-full rounded-lg border outline-0 border-neutral-300 px-3 lg:text-lg text-sm"
                  id="email"
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
              {/* demo credentials */}
              <div className="border border-amber-300 bg-amber-50 px-2 py-1 lg:px-4 lg:py-3 lg:mt-2 rounded-lg ">
                <h2 className="text-amber-800 text-sm lg:text-lg">
                  Demo credentials:
                </h2>
                <p className="text-amber-700 text-xs lg:text-sm">
                  Email: admin@example.com
                </p>
                <p className="text-amber-700 text-xs lg:text-sm">
                  Password: admin123
                </p>
              </div>
              <div className="flex flex-col lg:mt-2">
                <button className="bg-amber-400 py-2 lg:py-3 text-sm lg:text-lg rounded-lg text-white lg:font-semibold cursor-pointer hover:bg-amber-500 transition-all">
                  Sign In
                </button>
              </div>
            </form>
          </div>

          {/* form footer */}
          <div className="flex lg:justify-end justify-center ">
            <p className="lg:text-sm text-xs">
              Don't have account?{" "}
              <NavLink
                className="text-amber-500 font-semibold hover:underline"
                to={"/register"}
              >
                Register here
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
