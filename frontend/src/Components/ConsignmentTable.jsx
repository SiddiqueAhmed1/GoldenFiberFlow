import {
  Box,
  Edit,
  Eye,
  Filter,
  LucideDelete,
  Plus,
  Search,
  Trash2,
  View,
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { NavLink } from "react-router-dom";
import { consignmentId } from "../utils/ConsignmentId";
import { useAuth } from "../hooks/useAuth";

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
  const statusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-400";
      case "In transit":
        return "bg-blue-100 text-blue-700 border border-blue-400";
      case "Delivered":
        return "bg-green-100 text-green-700 border border-green-400";
      case "Cancelled":
        return "bg-red-100 text-red-700 border border-red-400";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-400";
    }
  };

  return (
    <>
      <section>
        <div className="border border-neutral-200 shadow bg-white rounded-lg p-6 mx-5 md:mx-0">
          {/* table header */}
          <div className="flex justify-between items-center gap-6">
            <div className="flex flex-1 items-center">
              <Search size={20} color="gray" className="absolute ml-3" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by consignment number, sender or receiver"
                required={true}
                name="searchQuery"
                className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-3 px-10 border-neutral-300 border w-full"
                type="text"
              />
            </div>

            <div className="flex items-center">
              <Filter size={20} color="gray" className="absolute ml-3" />
              <select
                name="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-3 px-10 border-neutral-300 border appearance-none w-full"
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
          <div className="my-5 text-center overflow-x-auto">
            <table
              className={`table-auto md:table-fixed ${consignments.length > 0 && "border"}  border-collapse border-gray-300 w-full text-center p-4 overflow-x-auto`}
            >
              {filteredConsignment.length > 0 ? (
                <thead className="bg-gray-50 ">
                  <tr className="border border-gray-300 text-sm font-light ">
                    <th className="px-6 py-3 text-center text-xs md:text-sm normal-case md:uppercase tracking-wider">
                      CONSIGNMENT NO
                    </th>
                    <th className="px-6 py-3 text-center text-xs md:text-sm normal-case md:uppercase tracking-wider">
                      SENDER
                    </th>
                    <th className="px-6 py-3 text-center text-xs md:text-sm normal-case md:uppercase tracking-wider">
                      RECEIVER
                    </th>
                    <th className="px-6 py-3 text-center text-xs md:text-sm normal-case md:uppercase tracking-wider">
                      ITEMS
                    </th>
                    <th className="px-6 py-3 text-center text-xs md:text-sm normal-case md:uppercase tracking-wider">
                      STATUS
                    </th>
                    {user.role === "Admin" && (
                      <th className="px-6 py-3 text-center text-xs md:text-sm normal-case md:uppercase tracking-wider">
                        CREATED_BY
                      </th>
                    )}
                    <th className="px-6 py-3 text-center text-xs md:text-sm normal-case md:uppercase tracking-wider">
                      CREATED
                    </th>
                    <th className="px-6 py-3 text-center text-xs md:text-sm normal-case md:uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
              ) : (
                ""
              )}
              <tbody className="w-full text-center">
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : filteredConsignment.length > 0 ? (
                  filteredConsignment.map((item) => (
                    <tr
                      key={item._id}
                      className="border border-gray-300 hover:bg-gray-50"
                    >
                      <td className="p-3 py-6 text-center text-xs md:text-sm">
                        {consignmentId(item._id)}
                      </td>
                      <td className="p-3 py-6 text-center text-xs md:text-sm">
                        {item.sender_details.name}
                      </td>
                      <td className="p-3 py-6 text-center text-xs md:text-sm">
                        {item.receiver_details.name}
                      </td>
                      <td className="p-3 py-6 text-center text-xs md:text-sm">
                        {item.items.length}
                      </td>
                      <td className="p-3 py-6 text-center text-xs md:text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyle(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      {user.role === "Admin" && (
                        <td className="p-3 py-6 text-center text-xs md:text-sm">
                          <button title={item?.createdBy?.name}>
                            {" "}
                            {item?.createdBy?.name?.length < 8
                              ? item?.createdBy?.name
                              : item?.createdBy?.name?.slice(0, 8) + "..."}
                          </button>
                        </td>
                      )}
                      <td className="p-3 py-6 text-center text-xs md:text-sm">
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="flex justify-center items-center p-3 py-6 gap-5">
                        <button
                          className="flex flex-col items-center cursor-pointer h-6 justify-center"
                          title="View"
                        >
                          <NavLink to={`/dashboard/consignment/${item._id}`}>
                            <Eye color="#576574" size={20} />
                          </NavLink>
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex flex-col items-center cursor-pointer h-6 justify-center"
                          title="Edit"
                        >
                          <Edit color="#576574" size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteConsignment(item._id)}
                          className="flex flex-col items-center cursor-pointer h-6 justify-center"
                          title="Delete"
                        >
                          <Trash2 color="#576574" size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <div className="text-center flex items-center justify-center flex-col gap-3 py-6 h-100">
                        <Box size={80} color="#bdc3c7" />
                        <h1 className="text-2xl font-semibold text-black">
                          No consignments found
                        </h1>
                        <p className="text-neutral-500 text-lg mb-2">
                          {filteredConsignment.length === 0
                            ? "Try adjusting your search or filter"
                            : "Get started by creating your first consignment"}
                        </p>
                        {!consignments.length > 0 && (
                          <button
                            onClick={() => setIsCreateConModal((prev) => !prev)}
                            className="flex items-center gap-1 border bg-blue-600 text-white font-sans text-sm md:text-lg px-3 py-3 rounded-md cursor-pointer hover:bg-blue-700 font-semibold"
                          >
                            <Plus /> Create Consignment
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
    </>
  );
};

export default ConsignmentTable;
