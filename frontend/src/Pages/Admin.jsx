import { Plus, Shield, Trash2, UserIcon, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { deleteUser, getUser } from "../Services/userService";
import UserModal from "../Components/UserModal";
import LoadingSpinner from "../Components/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [loader, setLoader] = useState(true);

  const loadUser = async () => {
    try {
      const data = await getUser();
      if (data) setUsers(data);
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const closeModal = () => setIsOpenUserModal(false);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u._id !== id));
        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch (error) {
        toast.error(error?.message);
      }
    }
  };

  const admins = users.filter((u) => u.role === "Admin").length;
  const regular = users.filter((u) => u.role !== "Admin").length;

  return (
    <>
      <section className="p-5 md:p-8 min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          {/* header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                Manage users and system settings
              </p>
            </div>
            <button
              onClick={() => setIsOpenUserModal(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2.5 rounded-xl font-medium cursor-pointer transition shadow-sm"
            >
              <Plus size={16} /> Create User
            </button>
          </div>

          {/* stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Total Users",
                value: users.length,
                icon: Users,
                color: "bg-gradient-to-br from-amber-400 to-yellow-600",
              },
              {
                label: "Administrators",
                value: admins,
                icon: Shield,
                color: "bg-gradient-to-br from-blue-500 to-blue-700",
              },
              {
                label: "Regular Users",
                value: regular,
                icon: UserIcon,
                color: "bg-gradient-to-br from-emerald-400 to-green-600",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 p-5 flex items-center gap-4 shadow-sm"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}
                >
                  <s.icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {s.label}
                  </p>
                  <p className="text-2xl font-bold text-neutral-800 dark:text-white">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* users table */}
          <div className="bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-700/50">
              <h2 className="text-base font-bold text-neutral-800 dark:text-white">
                User Management
              </h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                View and manage all system users
              </p>
            </div>

            {loader ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-700/40 border-b border-neutral-200 dark:border-neutral-700 text-left">
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Name
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Email
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Role
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Created At
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-t border-neutral-100 dark:border-neutral-700/40 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition"
                      >
                        <td className="px-5 py-3.5 font-medium text-neutral-800 dark:text-neutral-100">
                          {user.name}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {user.email}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${user.role === "Admin" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"}`}
                          >
                            {user.role === "Admin" ? (
                              <Shield size={11} />
                            ) : (
                              <UserIcon size={11} />
                            )}{" "}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {user.role !== "Admin" && (
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-400 hover:text-red-500 cursor-pointer transition"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {isOpenUserModal && (
        <UserModal
          closeModal={closeModal}
          setUsers={setUsers}
          setLoader={setLoader}
          loadUser={loadUser}
        />
      )}
    </>
  );
};
export default Admin;
