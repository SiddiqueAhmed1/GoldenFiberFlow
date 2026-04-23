import { X } from "lucide-react";
import { useState } from "react";

const UserModal = ({ setIsOpenUserModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  return (
    <>
      <section className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500/60 flex justify-center items-center">
        <div className="p-6 w-full max-w-130 bg-white shadow rounded">
          {/* form header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold mb-3">Create user</h1>
            <X
              onClick={() => setIsOpenUserModal(false)}
              className="cursor-pointer"
            />
          </div>
          {/* user form */}
          <form>
            <div className="flex flex-col gap-3 border-b border-neutral-300 pb-5">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm! mb-1">
                  Name *
                </label>
                <input
                  required={true}
                  name="name"
                  value={formData.name}
                  className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                  type="text"
                  id="name"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="email" className="text-sm! mb-1">
                  Email *
                </label>
                <input
                  required={true}
                  name="email"
                  value={formData.email}
                  className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                  type="text"
                  id="email"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="password" className="text-sm! mb-1">
                  Password *
                </label>
                <input
                  required={true}
                  name="password"
                  value={formData.password}
                  className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                  type="text"
                  id="password"
                />
              </div>
              <div className="flex flex-col ">
                <label htmlFor="role" className="text-sm! mb-1">
                  Role *
                </label>
                <select
                  className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                  name="role"
                  id="role"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-7">
              <button
                type="button"
                className=" border border-neutral-300 text-xs md:text-sm px-2 md:px-3 py-1 md:py-3 rounded-lg cursor-pointer "
              >
                Cancel
              </button>
              <button
                type="submit"
                className=" border bg-blue-600 text-white text-xs md:text-sm px-3 py-3 rounded-lg cursor-pointer hover:bg-blue-700"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default UserModal;
