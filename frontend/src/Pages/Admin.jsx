import { Plus, Shield, Trash2, User2, UserIcon, Users2 } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { deleteUser, getUser } from "../Services/userService";
import UserModal from "../Components/UserModal";
import LoadingSpinner from "../Components/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [loader, setLoader] = useState(true);

  // get users
  const loadUser = async () => {
    try {
      const data = await getUser();
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      return toast.error(error?.message);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  //handle close modal
  const closeModal = () => {
    setIsOpenUserModal(false);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const deletedItem = await deleteUser(id);
        if (!deletedItem) return toast.error("User not deleted");
        setUsers((prev) => prev.filter((user) => user._id !== id));
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } catch (error) {
        toast.error(error?.message);
      }
    }
  };

  return (
    <>
      <section className="bg-neutral-100 min-h-screen">
        <div className="max-w-360 mx-auto">
          {/* admin head */}
          <div className="flex justify-between items-center py-5 md:py-10 mx-3">
            <div className=" flex flex-col gap-1">
              <h1 className="md:text-4xl text-xl font-bold">Admin Panel</h1>
              <p className="text-neutral-600 text-sm md:text-lg">
                Manage users and system settings
              </p>
            </div>
            <div>
              <button
                onClick={() => setIsOpenUserModal(true)}
                className="flex items-center md:gap-1 border bg-blue-600 text-white text-sm md:text-lg px-2 md:px-3 py-1 md:py-3 rounded-md cursor-pointer hover:bg-blue-700"
              >
                <Plus /> Create User
              </button>
            </div>
          </div>

          {/* stats */}
          <div className="grid gap-8 md:grid-cols-3 mx-5 md:mx-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-4xl font-bold text-gray-900">
                {users?.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">Administrators</p>
              <p className="text-4xl font-bold text-gray-900">1</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">Regular Users</p>
              <p className="text-4xl font-bold text-gray-900">1</p>
            </div>
          </div>

          {/* users table card*/}
          <div className="bg-white rounded-lg shadow-sm border mt-6 border-gray-200 p-6 mx-5 md:mx-0">
            <h1 className="text-xl font-medium text-gray-900">
              User Management
            </h1>
            <p className="  text-sm text-gray-600 mt-1   ">
              View and manage all system users
            </p>

            {/* users table */}
            {loader ? (
              <LoadingSpinner />
            ) : (
              <div className="overflow-x-auto mt-5">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="border border-gray-300 text-xs md:text-sm font-light ">
                      <th className="px-6 py-3 text-left text-xs md:text-sm normal-case md:uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs md:text-sm normal-case md:uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs md:text-sm normal-case md:uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs md:text-sm normal-case md:uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-center text-xs md:text-sm normal-case md:uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users?.map((user) => (
                      <tr key={user?.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                          {user?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                          {user?.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border ${
                              user?.role === "Admin"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            {user?.role === "Admin" ? (
                              <Shield className="w-3 h-3" />
                            ) : (
                              <UserIcon className="w-3 h-3" />
                            )}
                            {user?.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                          {new Date(user?.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-xs md:text-sm">
                          {user?.role !== "Admin" && (
                            <button
                              title="Delete"
                              onClick={() => handleDelete(user?._id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
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

        {isOpenUserModal && (
          <UserModal
            closeModal={closeModal}
            setUsers={setUsers}
            setLoader={setLoader}
            loadUser={loadUser}
          />
        )}
      </section>
    </>
  );
};

export default Admin;
