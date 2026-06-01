import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import VehicleModal from "../Components/VehicleModal";
import { getVehicles, deleteVehicle } from "../Services/vehicleService";
import LoadingSpinner from "../Components/LoadingSpinner";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const statusStyle = (s) => {
  if (s === "Available")
    return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
  if (s === "On Trip")
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
  if (s === "Under Maintenance")
    return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
  return "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400";
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getVehicles()
      .then(setVehicles)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    setFiltered(
      vehicles.filter(
        (v) =>
          v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
          v.type.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, vehicles]);

  const handleEdit = (v) => {
    setSelected(v);
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
        await deleteVehicle(id);
        setVehicles((p) => p.filter((v) => v._id !== id));
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
                Vehicles
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                Manage all vehicle records
              </p>
            </div>
            <button
              onClick={() => setIsCreate(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2.5 rounded-xl font-medium cursor-pointer transition shadow-sm"
            >
              <Plus size={16} /> Add Vehicle
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by plate or type..."
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
              <div className="text-center py-20 text-neutral-400 dark:text-neutral-500">
                <p className="text-lg font-medium">
                  {search ? "No vehicles match your search" : "No vehicles yet"}
                </p>
                <p className="text-sm mt-1">
                  {!search && "Click 'Add Vehicle' to get started"}
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
                        Plate Number
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Type
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Capacity
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
                    {filtered.map((v, i) => (
                      <tr
                        key={v._id}
                        className="border-t border-neutral-100 dark:border-neutral-700/40 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition"
                      >
                        <td className="px-5 py-3.5 text-neutral-400 dark:text-neutral-500">
                          {i + 1}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-neutral-800 dark:text-neutral-100 tracking-wide">
                          {v.plateNumber}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {v.type}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {v.capacity}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(v.status)}`}
                          >
                            {v.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(v)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 cursor-pointer transition"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(v._id)}
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
          {!loading && vehicles.length > 0 && (
            <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">
              Showing {filtered.length} of {vehicles.length} vehicles
            </p>
          )}
        </div>
      </section>
      {isCreate && (
        <VehicleModal
          handleClose={handleClose}
          setVehicles={setVehicles}
          mode="create"
        />
      )}
      {isEdit && selected && (
        <VehicleModal
          handleClose={handleClose}
          setVehicles={setVehicles}
          mode="edit"
          selected={selected}
        />
      )}
    </>
  );
};
export default Vehicles;
