import { Box, Edit, Eye, Filter, Plus, Search, Trash2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { NavLink } from "react-router-dom";
import { consignmentId } from "../utils/consignmentId";
import { useAuth } from "../Hooks/useAuth";

const statusStyle = (status = "Pending") => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    case "In transit":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    case "Delivered":
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    case "Cancelled":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    default:
      return "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400";
  }
};

const ConsignmentTable = ({
  setIsCreateConModal,
  consignments,
  loading,
  handleDeleteConsignment,
  handleEdit,
  searchQuery,
  setSearchQuery,
  filteredConsignment,
  setStatusFilter,
  statusFilter,
}) => {
  const { user } = useAuth();

  return (
    <section>
      <div className="bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 shadow-sm overflow-hidden">
        {/* search + filter bar */}
        <div className="flex flex-col md:flex-row gap-3 p-5 border-b border-neutral-100 dark:border-neutral-700/50">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by consignment no, sender or receiver"
              className="w-full bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 rounded-xl py-2.5 pl-9 pr-4 text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 rounded-xl py-2.5 pl-9 pr-6 text-sm text-neutral-800 dark:text-neutral-100 outline-none focus:ring-2 focus:ring-amber-400 appearance-none transition cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In transit">In transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {filteredConsignment?.length > 0 && (
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-700/40 border-b border-neutral-200 dark:border-neutral-700 text-left">
                  <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400 text-center">
                    Con. No
                  </th>
                  <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                    Sender
                  </th>
                  <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                    Receiver
                  </th>
                  <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400 text-center">
                    Items
                  </th>
                  <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                    Status
                  </th>
                  {user?.role === "Admin" && (
                    <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                      Created By
                    </th>
                  )}
                  <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                    Date
                  </th>
                  <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
            )}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex justify-center py-20">
                      <LoadingSpinner />
                    </div>
                  </td>
                </tr>
              ) : filteredConsignment?.length > 0 ? (
                filteredConsignment.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-neutral-100 dark:border-neutral-700/40 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition"
                  >
                    <td className="px-5 py-3.5 text-center font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {consignmentId(item._id)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-neutral-800 dark:text-neutral-100">
                      {item.sender_details?.name}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                      {item.receiver_details?.name}
                    </td>
                    <td className="px-5 py-3.5 text-center text-neutral-600 dark:text-neutral-300">
                      {item.items?.length}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyle(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    {user?.role === "Admin" && (
                      <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300 text-xs">
                        {item.createdBy?.name?.slice(0, 10)}
                        {item.createdBy?.name?.length > 10 ? "…" : ""}
                      </td>
                    )}
                    <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-center gap-1">
                        <NavLink
                          to={`/dashboard/consignment/${item._id}`}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 transition"
                          title="View"
                        >
                          <Eye size={15} />
                        </NavLink>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 cursor-pointer transition"
                          title="Edit"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteConsignment(item._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer transition"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400 dark:text-neutral-500">
                      <Box size={60} strokeWidth={1} />
                      <p className="text-lg font-semibold text-neutral-600 dark:text-neutral-300">
                        No consignments found
                      </p>
                      <p className="text-sm">
                        {consignments.length > 0
                          ? "Try adjusting your search or filter"
                          : "Get started by creating your first consignment"}
                      </p>
                      {!consignments.length && (
                        <button
                          onClick={() => setIsCreateConModal(true)}
                          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2.5 rounded-xl font-medium cursor-pointer transition mt-1"
                        >
                          <Plus size={16} /> Create Consignment
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
export default ConsignmentTable;
