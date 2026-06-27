import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { updateInvoice } from "../Services/invoiceService";
import { toast } from "react-hot-toast";

const inp = "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition";
const Label = ({ children }) => <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">{children}</label>;
const Section = ({ children }) => <h2 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">{children}</h2>;

const InvoiceModal = ({ handleClose, setInvoices, selected }) => {
  const [form, setForm] = useState({ advanceAmount: "", dueDate: "", note: "" });
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selected) {
      const d = {
        advanceAmount: selected.advanceAmount,
        dueDate: selected.dueDate?.slice(0, 10) || "",
        note: selected.note || "",
      };
      setForm(d);
      setOriginal(d);
    }
  }, [selected]);

  const dueAmount = Math.max(0, (selected?.totalAmount || 0) - (Number(form.advanceAmount) || 0));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (JSON.stringify(original) === JSON.stringify(form)) return toast.error("Nothing to update");
      const payload = {
        advanceAmount: Number(form.advanceAmount) || 0,
        dueDate: form.dueDate || undefined,
        note: form.note,
      };
      const data = await updateInvoice(selected._id, payload);
      setInvoices((p) => p.map((i) => (i._id === selected._id ? data : i)));
      toast.success("Payment status updated");
      handleClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-800 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl mx-4 shadow-2xl">
        <div className="sticky top-0 flex justify-between items-start border-b border-neutral-200 dark:border-neutral-700 p-5 bg-white dark:bg-neutral-800 z-10">
          <div>
            <h1 className="text-lg font-bold text-neutral-800 dark:text-white">Update Payment</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Invoice {selected?.invoiceNumber} · {selected?.customer?.name}
            </p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-pointer transition"><X size={18} /></button>
        </div>
        <div className="p-5">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4 space-y-3">
              <Section>Order Info (read-only)</Section>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Sales Order</Label><input readOnly value={selected?.salesOrder?.orderNumber || "—"} className={`${inp} bg-neutral-100 dark:bg-neutral-600 cursor-not-allowed`} /></div>
                <div><Label>Customer</Label><input readOnly value={selected?.customer?.name || "—"} className={`${inp} bg-neutral-100 dark:bg-neutral-600 cursor-not-allowed`} /></div>
              </div>
              <div><Label>Total Amount (৳)</Label><input readOnly value={selected?.totalAmount || 0} className={`${inp} bg-neutral-100 dark:bg-neutral-600 cursor-not-allowed`} /></div>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4 space-y-3">
              <Section>Payment Details</Section>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Advance Received (৳)</Label><input type="number" min="0" max={selected?.totalAmount} value={form.advanceAmount} onChange={(e) => setForm((p) => ({ ...p, advanceAmount: e.target.value }))} className={inp} placeholder="0" /></div>
                <div><Label>Due Amount (৳)</Label><input readOnly value={dueAmount} className={`${inp} bg-neutral-100 dark:bg-neutral-600 cursor-not-allowed`} /></div>
              </div>
              <div><Label>Due Date</Label><input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} className={inp} /></div>
              <div><Label>Note</Label><input value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} className={inp} placeholder="Optional note" /></div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={handleClose} className="px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 text-sm rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium cursor-pointer transition disabled:opacity-60">
                {loading ? "Saving..." : "Update Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
export default InvoiceModal;
