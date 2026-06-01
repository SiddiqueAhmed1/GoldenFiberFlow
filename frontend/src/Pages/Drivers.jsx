import { Plus, Pencil, Trash2, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import DriverModal from "../Components/DriverModal";
import { getDrivers, deleteDriver } from "../Services/driverService";
import LoadingSpinner from "../Components/LoadingSpinner";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const statusStyle = (s) => {
  if (s === "Available")
    return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
  if (s === "On Trip")
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
  return "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400";
};

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getDrivers()
      .then(setDrivers)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    setFiltered(
      drivers.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.licenseNumber.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, drivers]);

  const handleEdit = (d) => {
    setSelected(d);
    setIsEdit(true);
  };
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (r) => {
      if (r.isConfirmed) {
        await deleteDriver(id);
        setDrivers((p) => p.filter((d) => d._id !== id));
        Swal.fire("Deleted!", "", "success");
      }
    });
  };
  const handleClose = () => {
    setIsCreate(false);
    setIsEdit(false);
    setSelected(null);
  };

  return (
    <>
      <section className="p-5 md:p-8 min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white">
                Drivers
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                Manage all driver records
              </p>
            </div>
            <button
              onClick={() => setIsCreate(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2.5 rounded-xl font-medium cursor-pointer transition shadow-sm"
            >
              <Plus size={16} /> Add Driver
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or license number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>

          <div className="bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400 dark:text-neutral-500">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-700/50 flex items-center justify-center">
                  <Truck size={32} strokeWidth={1.2} />
                </div>
                <p className="text-base font-semibold text-neutral-600 dark:text-neutral-300">
                  {search ? "No drivers match your search" : "No drivers yet"}
                </p>
                <p className="text-sm mt-1">
                  {!search && "Click 'Add Driver' to get started"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-700/40 border-b border-neutral-200 dark:border-neutral-700 text-left">
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        #
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Name
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Mobile
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        License No
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Expiry
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Status
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d, i) => (
                      <tr
                        key={d._id}
                        className="border-t border-neutral-100 dark:border-neutral-700/40 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition"
                      >
                        <td className="px-5 py-3.5 text-neutral-400 dark:text-neutral-500">
                          {i + 1}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-neutral-800 dark:text-neutral-100">
                          {d.name}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {d.mobile}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {d.licenseNumber}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {d.licenseExpiry
                            ? new Date(d.licenseExpiry).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(d.status)}`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(d)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 cursor-pointer transition"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(d._id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer transition"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {!loading && drivers.length > 0 && (
            <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">
              Showing {filtered.length} of {drivers.length} drivers
            </p>
          )}
        </div>
      </section>
      {isCreate && (
        <DriverModal
          handleClose={handleClose}
          setDrivers={setDrivers}
          mode="create"
        />
      )}
      {isEdit && selected && (
        <DriverModal
          handleClose={handleClose}
          setDrivers={setDrivers}
          mode="edit"
          selected={selected}
        />
      )}
    </>
  );
};
export default Drivers;
