import { Plus, Pencil, Trash2, Users, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CustomerModal from "../Components/CustomerModal";
import {
  getCustomers,
  deleteCustomer,
  bulkImportCustomers,
} from "../Services/customerService";
import LoadingSpinner from "../Components/LoadingSpinner";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

const statusStyle = (s) =>
  s === "Active"
    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";

const EmptyState = ({ search }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400 dark:text-neutral-500">
    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-700/50 flex items-center justify-center">
      <Users size={32} strokeWidth={1.2} />
    </div>
    <p className="text-base font-semibold text-neutral-600 dark:text-neutral-300">
      {search ? "No customers match your search" : "No customers yet"}
    </p>
    <p className="text-sm">
      {!search && "Click 'Add Customer' to get started"}
    </p>
  </div>
);

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFiltered(
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.businessName || "").toLowerCase().includes(search.toLowerCase()) ||
          String(c.mobile).includes(search),
      ),
    );
  }, [search, customers]);

  const handleEdit = (c) => {
    setSelected(c);
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
        try {
          await deleteCustomer(id);
          setCustomers((p) => p.filter((c) => c._id !== id));
          Swal.fire("Deleted!", "", "success");
        } catch (e) {
          Swal.fire("Cannot Delete", e.message, "error");
        }
      }
    });
  };

  const handleClose = () => {
    setIsCreate(false);
    setIsEdit(false);
    setSelected(null);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    try {
      setImporting(true);
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws);

      // Expected headers: name, mobile, email, address, businessName, status
      const mapped = rows.map((r) => ({
        name: r["name"] || r["Name"] || "",
        mobile: r["mobile"] || r["Mobile"] || "",
        email: r["email"] || r["Email"] || "",
        address: r["address"] || r["Address"] || "",
        businessName:
          r["businessName"] || r["Business Name"] || r["business_name"] || "",
        status: r["status"] || r["Status"] || "Active",
      }));

      const result = await bulkImportCustomers(mapped);
      toast.success(result.message);

      const updated = await getCustomers();
      setCustomers(updated);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <section className="p-5 md:p-8 min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white">
                Customers
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                Manage all customer records
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <p className="text-red-600 dark:text-yellow-400 text-xs mt-1">
                * Columns must be Name, <br /> Address, Mobile and Status
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={handleImportClick}
                disabled={importing}
                className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-sm px-4 py-2.5 rounded-xl font-medium cursor-pointer transition shadow-sm disabled:opacity-50"
              >
                <Upload size={16} />
                {importing ? "Importing..." : "Import Excel"}
              </button>
              <button
                onClick={() => setIsCreate(true)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2.5 rounded-xl font-medium cursor-pointer transition shadow-sm"
              >
                <Plus size={16} /> Add Customer
              </button>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, business or mobile..."
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
                      {[
                        "#",
                        "Name",
                        "Business",
                        "Mobile",
                        "Email",
                        "Address",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400 ${h === "Actions" ? "text-center" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, i) => (
                      <tr
                        key={c._id}
                        className="border-t border-neutral-100 dark:border-neutral-700/40 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition"
                      >
                        <td className="px-5 py-3.5 text-neutral-400 dark:text-neutral-500">
                          {i + 1}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-neutral-800 dark:text-neutral-100">
                          {c.name}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {c.businessName || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {c.mobile}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {c.email || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">
                          {c.address}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(c.status)}`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(c)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 cursor-pointer transition"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
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
          {!loading && customers.length > 0 && (
            <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">
              Showing {filtered.length} of {customers.length} customers
            </p>
          )}
        </div>
      </section>
      {isCreate && (
        <CustomerModal
          handleClose={handleClose}
          setCustomers={setCustomers}
          mode="create"
        />
      )}
      {isEdit && selected && (
        <CustomerModal
          handleClose={handleClose}
          setCustomers={setCustomers}
          mode="edit"
          selected={selected}
        />
      )}
    </>
  );
};
export default Customers;
