import { Pencil, Trash2, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import InvoiceModal from "../Components/InvoiceModal";
import { getInvoices, deleteInvoice } from "../Services/invoiceService";
import LoadingSpinner from "../Components/LoadingSpinner";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const statusStyle = (s) => {
  const map = {
    Unpaid:  "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    Partial: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    Paid:    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  };
  return map[s] || "bg-neutral-100 dark:bg-neutral-700 text-neutral-600";
};

const EmptyState = ({ search }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400 dark:text-neutral-500">
    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-700/50 flex items-center justify-center">
      <FileText size={32} strokeWidth={1.2} />
    </div>
    <p className="text-base font-semibold text-neutral-600 dark:text-neutral-300">{search ? "No invoices match your search" : "No invoices yet"}</p>
    <p className="text-sm">{!search && "Invoices are created automatically when you create a sales order"}</p>
  </div>
);

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { getInvoices().then(setInvoices).catch((e) => toast.error(e.message)).finally(() => setLoading(false)); }, []);
  useEffect(() => {
    setFiltered(invoices.filter((i) =>
      (i.invoiceNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (i.customer?.name || "").toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, invoices]);

  const handleEdit = (i) => { setSelected(i); setIsEdit(true); };
  const handleDelete = (id) => {
    Swal.fire({ title: "Are you sure?", icon: "warning", showCancelButton: true, confirmButtonColor: "#f59e0b", cancelButtonColor: "#d33", confirmButtonText: "Yes, delete!" })
      .then(async (r) => { if (r.isConfirmed) { await deleteInvoice(id); setInvoices((p) => p.filter((i) => i._id !== id)); Swal.fire("Deleted!", "", "success"); } });
  };
  const handleClose = () => { setIsEdit(false); setSelected(null); };

  const totalRevenue = invoices.reduce((a, i) => a + (i.totalAmount || 0), 0);
  const totalReceived = invoices.reduce((a, i) => a + (i.advanceAmount || 0), 0);
  const totalDue = invoices.reduce((a, i) => a + (i.dueAmount || 0), 0);

  return (
    <>
      <section className="p-5 md:p-8 min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white">Invoices</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Auto-generated from sales orders — update payment status here</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Revenue", value: `৳ ${totalRevenue.toLocaleString()}`, color: "from-amber-400 to-yellow-600" },
              { label: "Total Received", value: `৳ ${totalReceived.toLocaleString()}`, color: "from-green-400 to-emerald-600" },
              { label: "Total Due", value: `৳ ${totalDue.toLocaleString()}`, color: "from-red-400 to-red-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-neutral-800/70 rounded-2xl border border-neutral-200 dark:border-neutral-700/50 p-4 shadow-sm">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{s.label}</p>
                <p className={`text-xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent mt-1`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <input type="text" placeholder="Search by invoice no or customer..." value={search} onChange={(e) => setSearch(e.target.value)}
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
                        {["Invoice No", "Customer", "Sales Order", "Total (৳)", "Received (৳)", "Due (৳)", "Status", "Due Date", "Actions"].map((h) => (
                          <th key={h} className={`px-5 py-3 font-medium text-neutral-500 dark:text-neutral-400 ${h === "Actions" ? "text-center" : ""}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((inv) => (
                        <tr key={inv._id} className="border-t border-neutral-100 dark:border-neutral-700/40 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition">
                          <td className="px-5 py-3.5 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">{inv.invoiceNumber}</td>
                          <td className="px-5 py-3.5 font-medium text-neutral-800 dark:text-neutral-100">{inv.customer?.name || "—"}</td>
                          <td className="px-5 py-3.5 font-mono text-xs text-neutral-500 dark:text-neutral-400">{inv.salesOrder?.orderNumber || "—"}</td>
                          <td className="px-5 py-3.5 text-neutral-600 dark:text-neutral-300">৳ {inv.totalAmount?.toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-green-600 dark:text-green-400">৳ {inv.advanceAmount?.toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-red-500 dark:text-red-400">৳ {inv.dueAmount?.toLocaleString()}</td>
                          <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle(inv.status)}`}>{inv.status}</span></td>
                          <td className="px-5 py-3.5 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleEdit(inv)} title="Update payment" className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 cursor-pointer transition"><Pencil size={15} /></button>
                              <button onClick={() => handleDelete(inv._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer transition"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
          {!loading && invoices.length > 0 && <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">Showing {filtered.length} of {invoices.length} invoices</p>}
        </div>
      </section>
      {isEdit && selected && <InvoiceModal handleClose={handleClose} setInvoices={setInvoices} selected={selected} />}
    </>
  );
};
export default Invoices;
