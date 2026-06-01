import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { createUser } from "../Services/userService";

const inp =
  "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 transition";

const UserModal = ({ closeModal, setUsers, setLoader, loadUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const data = await createUser(formData);
      setUsers((p) => [...p, data]);
      loadUser();
      closeModal();
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoader(false);
      setFormData({ name: "", email: "", password: "", role: "User" });
    }
  };

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-800 w-full max-w-md rounded-2xl mx-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 p-5">
          <div>
            <h1 className="text-lg font-bold text-neutral-800 dark:text-white">
              Create User
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Add a new system user
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-pointer transition"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                Name *
              </label>
              <input
                onChange={handleInput}
                required
                name="name"
                value={formData.name}
                className={inp}
                type="text"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                Email *
              </label>
              <input
                onChange={handleInput}
                required
                name="email"
                value={formData.email}
                className={inp}
                type="email"
                placeholder="e.g. john@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                Password *
              </label>
              <input
                onChange={handleInput}
                required
                name="password"
                value={formData.password}
                className={inp}
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                Role *
              </label>
              <select
                onChange={(e) =>
                  setFormData((p) => ({ ...p, role: e.target.value }))
                }
                value={formData.role}
                className={inp}
                name="role"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium cursor-pointer transition"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
export default UserModal;
