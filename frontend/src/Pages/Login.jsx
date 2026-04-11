import { NavLink } from "react-router-dom";
import logo from "../../public/gftcl.png";

export const Login = () => {
  return (
    <>
      <section className="flex items-center justify-center h-screen bg-blue-50">
        <div className="shadow-md drop-shadow-lg shadow-amber-500/10 bg-white rounded-2xl border border-amber-50 w-550 h-700 m-auto px-9 py-11">
          <div className="loing-metadata flex flex-col justify-center items-center gap-1">
            <img
              className="mb-3"
              height={70}
              width={70}
              src={logo}
              alt="GFTCL"
            />
            <h1 className="">Welcome Back</h1>
            <p className="text-lg text-neutral-600 font-medium">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="my-8">
            <form className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="email">Email</label>
                <input
                  className="focus-within:outline-amber-500 focus-within:outline-4"
                  id="email"
                  type="text"
                  placeholder="admin@example.com"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
              <div className="border border-amber-300 bg-amber-50 px-4 py-3 mt-2 rounded-lg ">
                <h2 className="text-amber-800 text-lg">Demo credentials:</h2>
                <p className="text-amber-700 text-sm">
                  Email: admin@example.com
                </p>
                <p className="text-amber-700 text-sm">Password: admin123</p>
              </div>
              <div className="flex flex-col mt-2">
                <button className="bg-amber-400 py-3 rounded-lg text-white font-semibold cursor-pointer hover:bg-amber-500 transition-all">
                  Sign In
                </button>
              </div>
            </form>
          </div>
          {/* form footer */}
          <div className="flex justify-end">
            <p>
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
