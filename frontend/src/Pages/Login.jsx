import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/gftcl.png";
import { useState } from "react";
import { login } from "../Services/authService";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const { setUser, setLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // handle input
  const handleInputValue = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handle form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.email || !formData.password) {
        return toast.error("all fields are required");
      }
      setLoading(true);
      const data = await login(formData.email, formData.password);
      setLoading(false);
      if (data) {
        setUser(data);
        navigate("/dashboard");
      }
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(error || error.message);
    }
  };

  return (
    <>
      <section className="flex items-center justify-center h-screen bg-blue-50">
        <div className="shadow-md drop-shadow-lg shadow-amber-500/10 bg-white rounded-2xl border border-amber-50 w-85 h-140 lg:w-[550px] lg:h-[670px] m-auto px-6 pt-6 lg:px-9 lg:pt-9">
          {/* login-metadata */}
          <div className=" flex flex-col justify-center items-center gap-1">
            <img
              className="mb-3"
              height={70}
              width={70}
              src={logo}
              alt="GFTCL"
            />
            <h1 className="text-lg lg:text-2xl font-semibold">Welcome Back</h1>
            <p className="text-center lg:w-full w-40 text-sm lg:text-lg text-neutral-600 font-medium">
              Enter your credentials to access your account
            </p>
          </div>

          {/* login form */}
          <div className="my-4 lg:my-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="emailId">Email</label>
                <input
                  className="focus-within:outline-blue-600 focus-within:outline-2 h-11 lg:h-[52px] w-full rounded-lg border outline-0 border-neutral-300 px-3 lg:text-lg text-sm"
                  id="emailId"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputValue}
                  placeholder="admin@example.com"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="password">Password</label>
                <input
                  className="focus-within:outline-blue-600 focus-within:outline-2 h-11 lg:h-[52px] w-full rounded-lg border outline-0 border-neutral-300 px-3 lg:text-lg text-sm"
                  id="password"
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputValue}
                  placeholder="Enter your password"
                />
              </div>
              {/* demo credentials */}
              <div className="border border-blue-300 bg-blue-50 px-2 py-1 lg:px-4 lg:py-3 lg:mt-2 rounded-lg ">
                <h2 className="text-blue-800 text-sm lg:text-lg">
                  Demo credentials:
                </h2>
                <p className="text-blue-700 text-xs lg:text-sm">
                  Email: admin@example.com
                </p>
                <p className="text-blue-700 text-xs lg:text-sm">
                  Password: admin123
                </p>
              </div>
              <div className="flex flex-col lg:mt-2">
                <button
                  type="submit"
                  className="bg-blue-600 py-2 lg:py-3 text-sm lg:text-lg rounded-lg text-white lg:font-semibold cursor-pointer hover:bg-blue-500 transition-all"
                >
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
                className="text-blue-500 font-semibold hover:underline"
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
