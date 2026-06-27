import { Plus, Pencil, Trash2, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import SalesOrderModal from "../Components/SalesOrderModal";
import { getSalesOrders, deleteSalesOrder } from "../Services/salesOrderService";
import LoadingSpinner from "../Components/LoadingSpinner";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const statusStyle = (s) => {
  const map = {
    Pending:     "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    Confirmed:   "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    "In Transit":"bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400",
    Delivered:   "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    Cancelled:   "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  };
  return map[s] || "bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300";
};

const EmptyState = ({ search }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400 dark:text-neutral-500">
    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-700/50 flex items-center justify-center">
      <ShoppingCart size={32} strokeWidth={1.2} />
    </div>
    <p className="text-base font-semibold text-neutral-600 dark:text-neutral-300">{search ? "No orders match your search" : "No sales orders yet"}</p>
    <p className="text-sm">{!search && "Click 'Create Order' to get started"}</p>
  </div>
);

const SalesOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { getSalesOrders().then(setOrders).catch((e) => toast.error(e.message)).finally(() => setLoading(false)); }, []);
  useEffect(() => {
    setFiltered(orders.filter((o) =>
      (o.orderNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.customer?.name || "").toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, orders]);

  const handleEdit = (o) => { setSelected(o); setIsEdit(true); };
  const handleDelete = (id) => {
    Swal.fire({ title: "Are you sure?", icon: "warning", showCancelButton: true, confirmButtonColor: "#f59e0b", cancelButtonColor: "#d33", confirmButtonText: "Yes, delete!" })
      .then(async (r) => { if (r.isConfirmed) { await deleteSalesOrder(id); setOrders((p) => p.filter((o) => o._id !== id)); Swal.fire("Deleted!", "", "success"); } });
  };
  const handleClose = () => { setIsCreate(false); setIsEdit(false); setSelected(null); };

  return (
    <>
      <section className="p-5 md:p-8 min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white">Sales Orders</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Manage all customer sales orders</p>
            </div>
            <button onClick={() => setIsCreate(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2.5 rounded-xl font-medium cursor-pointer transition shadow-sm">
              <Plus size={16} /> Create Order
            </button>
          </div>

          <div className="mb-4">
            <input type="text" placeholder="Search by order no or customer..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:ring-2 focus:ring-amber-400 transition" />
          </div>

          <div className="bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 overflow-hidden shadow-sm">
            {loading ? (<div className="flex justify-center py-20"><LoadingSpinner /></div>)
              : filtered.length === 0 ? (<EmptyState search={search} />)
              : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-700/40 border-b border-neutral-200 dark:border-neutral-700 text-left">
                        {["Order No", "Customer", "Items", "Total (৳)", "Advance (৳)", "Due (৳)", "Status", "Date", "Actions"].map((h) => (
                          <th key={h} className={`px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400 ${h === "Actions" ? "text-center" : ""}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((o) => (
                        <tr key={o._id} className="border-t border-neutral-100 dark:border-neutral-700/40 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition">
                          <td className="px-5 py-3.5 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">{o.orderNumber}</td>
                          <td className="px-5 py-3.5 font-medium text-neutral-800 dark:text-neutral-100">{o.customer?.name || "—"}</td>
                          <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300 text-center">{o.items?.length}</td>
                          <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">৳ {o.totalAmount?.toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-green-600 dark:text-green-400">৳ {o.advanceAmount?.toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-red-500 dark:text-red-400">৳ {o.dueAmount?.toLocaleString()}</td>
                          <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusStyle(o.status)}`}>{o.status}</span></td>
                          <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleEdit(o)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 cursor-pointer transition"><Pencil size={15} /></button>
                              <button onClick={() => handleDelete(o._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer transition"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
          {!loading && orders.length > 0 && <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">Showing {filtered.length} of {orders.length} orders</p>}
        </div>
      </section>
      {isCreate && <SalesOrderModal handleClose={handleClose} setOrders={setOrders} mode="create" />}
      {isEdit && selected && <SalesOrderModal handleClose={handleClose} setOrders={setOrders} mode="edit" selected={selected} />}
    </>
  );
};
export default SalesOrders;
