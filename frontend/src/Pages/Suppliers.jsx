import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import SupplierModal from "../Components/SupplierModal";
import { getSuppliers, deleteSupplier } from "../Services/supplierService";
import LoadingSpinner from "../Components/LoadingSpinner";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const statusStyle = (s) =>
  s === "Active"
    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";

const EmptyState = ({ search }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400 dark:text-neutral-500">
    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-700/50 flex items-center justify-center">
      <Building2 size={32} strokeWidth={1.2} />
    </div>
    <p className="text-base font-semibold text-neutral-600 dark:text-neutral-300">
      {search ? "No suppliers match your search" : "No suppliers yet"}
    </p>
    <p className="text-sm">
      {!search && "Click 'Add Supplier' to get started"}
    </p>
  </div>
);

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getSuppliers()
      .then(setSuppliers)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    setFiltered(
      suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, suppliers]);

  const handleEdit = (s) => {
    setSelected(s);
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
        await deleteSupplier(id);
        setSuppliers((p) => p.filter((s) => s._id !== id));
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
                Suppliers
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                Manage all supplier records
              </p>
            </div>
            <button
              onClick={() => setIsCreate(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2.5 rounded-xl font-medium cursor-pointer transition shadow-sm"
            >
              <Plus size={16} /> Add Supplier
            </button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, contact person or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>
          <div className="bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState search={search} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-700/40 border-b border-neutral-200 dark:border-neutral-700 text-left">
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        #
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Company
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Contact Person
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Mobile
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Email
                      </th>
                      <th className="px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400">
                        Payment Terms
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
                    {filtered.map((s, i) => (
                      <tr
                        key={s._id}
                        className="border-t border-neutral-100 dark:border-neutral-700/40 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition"
                      >
                        <td className="px-5 py-3.5 text-neutral-400 dark:text-neutral-500">
                          {i + 1}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-neutral-800 dark:text-neutral-100">
                          {s.name}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {s.contactPerson}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {s.mobile}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {s.email}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                            {s.paymentTerms}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(s.status)}`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(s)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 cursor-pointer transition"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(s._id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer transition"
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
          {!loading && suppliers.length > 0 && (
            <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">
              Showing {filtered.length} of {suppliers.length} suppliers
            </p>
          )}
        </div>
      </section>
      {isCreate && (
        <SupplierModal
          handleClose={handleClose}
          setSuppliers={setSuppliers}
          mode="create"
        />
      )}
      {isEdit && selected && (
        <SupplierModal
          handleClose={handleClose}
          setSuppliers={setSuppliers}
          mode="edit"
          selectedSupplier={selected}
        />
      )}
    </>
  );
};
export default Suppliers;
