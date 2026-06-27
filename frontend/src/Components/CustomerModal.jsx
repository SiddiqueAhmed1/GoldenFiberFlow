import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createCustomer, updateCustomer } from "../Services/customerService";
import { toast } from "react-hot-toast";

const empty = { name: "", mobile: "", email: "", address: "", businessName: "", status: "Active" };
const inp = "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition";

const CustomerModal = ({ handleClose, setCustomers, mode, selected }) => {
  const [form, setForm] = useState(empty);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && selected) {
      const d = { name: selected.name, mobile: selected.mobile, email: selected.email || "", address: selected.address, businessName: selected.businessName || "", status: selected.status };
      setForm(d); setOriginal(d);
    }
  }, [mode, selected]);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (mode === "create") {
        const data = await createCustomer(form);
        setCustomers((p) => [...p, data]);
        toast.success("Customer created successfully");
        handleClose();
      } else {
        if (JSON.stringify(original) === JSON.stringify(form)) return toast.error("Nothing to update");
        const data = await updateCustomer(selected._id, form);
        setCustomers((p) => p.map((c) => (c._id === selected._id ? data : c)));
        toast.success("Customer updated successfully");
        handleClose();
      }
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-800 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl mx-4 shadow-2xl">
        <div className="sticky top-0 flex justify-between items-start border-b border-neutral-200 dark:border-neutral-700 p-5 bg-white dark:bg-neutral-800 z-10">
          <div>
            <h1 className="text-lg font-bold text-neutral-800 dark:text-white">{mode === "edit" ? "Update Customer" : "Add Customer"}</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{mode === "edit" ? "Change one field to update" : "Fill in the customer details"}</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-pointer transition"><X size={18} /></button>
        </div>
        <div className="p-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Personal Info</h2>
              <div><label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">Full Name *</label><input required name="name" value={form.name} onChange={onChange} className={inp} placeholder="e.g. Rahim Uddin" /></div>
              <div><label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">Business Name</label><input name="businessName" value={form.businessName} onChange={onChange} className={inp} placeholder="e.g. Rahim Traders (optional)" /></div>
              <div><label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">Address *</label><input required name="address" value={form.address} onChange={onChange} className={inp} placeholder="e.g. Narsingdi, Dhaka" /></div>
            </div>
            <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <h2 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Contact & Status</h2>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">Mobile *</label><input required name="mobile" value={form.mobile} onChange={onChange} className={inp} type="number" placeholder="01xxxxxxxxx" /></div>
                <div><label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">Email</label><input name="email" value={form.email} onChange={onChange} className={inp} type="email" placeholder="optional" /></div>
              </div>
              <div><label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">Status *</label>
                <select name="status" value={form.status} onChange={onChange} className={inp}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={handleClose} className="px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 text-sm rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium cursor-pointer transition disabled:opacity-60">
                {loading ? "Saving..." : mode === "edit" ? "Update Customer" : "Add Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
export default CustomerModal;
