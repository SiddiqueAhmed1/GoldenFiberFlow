import { X, Upload } from "lucide-react"; // Imported Upload icon for the bulk UI
import { useEffect, useState } from "react";
import {
  createSupplier,
  updateSupplier,
  uploadSupplierExcel,
} from "../Services/supplierService"; // Imported new bulk import service
import { toast } from "react-hot-toast";

const empty = {
  name: "",
  contactPerson: "",
  mobile: "",
  email: "",
  address: "",
  paymentTerms: "Cash",
  status: "Active",
};

const inp =
  "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 transition";

const SupplierModal = ({
  handleClose,
  setSuppliers,
  mode,
  selectedSupplier,
}) => {
  const [form, setForm] = useState(empty);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [excelFile, setExcelFile] = useState(null); // Local state to store selected Excel file object

  useEffect(() => {
    if (mode === "edit" && selectedSupplier) {
      const d = {
        name: selectedSupplier.name,
        contactPerson: selectedSupplier.contactPerson,
        mobile: selectedSupplier.mobile,
        email: selectedSupplier.email,
        address: selectedSupplier.address,
        paymentTerms: selectedSupplier.paymentTerms,
        status: selectedSupplier.status,
      };
      setForm(d);
      setOriginal(d);
    }
  }, [mode, selectedSupplier]);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // Handler for manual one-by-one supplier form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "create") {
        const data = await createSupplier(form);
        setSuppliers((p) => [...p, data]);
        toast.success("Supplier created successfully");
        handleClose();
      } else {
        if (JSON.stringify(original) === JSON.stringify(form))
          return toast.error("Nothing to update");
        const data = await updateSupplier(selectedSupplier._id, form);
        setSuppliers((p) =>
          p.map((s) => (s._id === selectedSupplier._id ? data : s)),
        );
        toast.success("Supplier updated successfully");
        handleClose();
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handler for Excel file bulk import submission
  const handleExcelSubmit = async (e) => {
    e.preventDefault();
    if (!excelFile) return toast.error("Please select an Excel file first");

    const formData = new FormData();
    formData.append("file", excelFile);

    setLoading(true);
    try {
      const res = await uploadSupplierExcel(formData);

      if (res.success) {
        // Optimistically update the table state with newly imported suppliers without page reload
        if (res.data && res.data.length > 0) {
          setSuppliers((p) => [...p, ...res.data]);
        }

        // Show detailed notification about successfully inserted rows and skipped duplicates
        toast.success(
          `${res.insertedCount} suppliers added. ${res.skippedCount} duplicates skipped.`,
        );
        handleClose();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Excel upload failed",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-800 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl mx-4 shadow-2xl">
        <div className="sticky top-0 flex justify-between items-start border-b border-neutral-200 dark:border-neutral-700 p-5 bg-white dark:bg-neutral-800 z-10">
          <div>
            <h1 className="text-lg font-bold text-neutral-800 dark:text-white">
              {mode === "edit" ? "Update Supplier" : "Add Supplier"}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {mode === "edit"
                ? "Change one field to update"
                : "Fill in the details to add a new supplier"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-pointer transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {/* Render Excel Upload UI wrapper block only in 'create' mode */}
          {mode === "create" && (
            <div className="mb-6 p-4 border border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
              <h3 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Upload size={14} className="text-amber-500" /> Bulk Import via
                Excel
              </h3>
              <div className="flex gap-2 items-center">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => setExcelFile(e.target.files[0])}
                  className="block w-full text-xs text-neutral-500 dark:text-neutral-400
                    file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0
                    file:text-xs file:font-medium file:bg-amber-50 file:text-amber-700
                    dark:file:bg-neutral-700 dark:file:text-neutral-200 hover:file:opacity-80 cursor-pointer"
                />
                <button
                  type="button"
                  disabled={loading || !excelFile}
                  onClick={handleExcelSubmit}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs py-2 px-3 rounded-lg disabled:opacity-50 transition cursor-pointer shrink-0"
                >
                  {loading ? "Processing..." : "Upload"}
                </button>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1.5">
                * Columns must be named:{" "}
                <span className="font-mono bg-neutral-200 dark:bg-neutral-700 px-1 rounded text-neutral-600 dark:text-neutral-300">
                  Company Name, Contact Person, Mobile, Email, Address
                </span>
              </p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Visual separator between Bulk Import and Manual Form */}
            {mode === "create" && (
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-neutral-200 dark:border-neutral-700"></div>
                <span className="flex-shrink mx-4 text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                  Or Add Manually
                </span>
                <div className="flex-grow border-t border-neutral-200 dark:border-neutral-700"></div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                Company Info
              </h2>
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                  Company Name *
                </label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className={inp}
                  placeholder="e.g. Dhaka Textile Ltd."
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                  Contact Person *
                </label>
                <input
                  required
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={onChange}
                  className={inp}
                  placeholder="e.g. Mr. Karim"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                  Address *
                </label>
                <input
                  required
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  className={inp}
                  placeholder="e.g. 45 Mirpur Road, Dhaka"
                />
              </div>
            </div>

            <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                Contact Info
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                    Mobile *
                  </label>
                  <input
                    required
                    name="mobile"
                    value={form.mobile}
                    onChange={onChange}
                    className={inp}
                    type="number"
                    placeholder="01712345678"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                    Email *
                  </label>
                  <input
                    required
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    className={inp}
                    type="email"
                    placeholder="supplier@company.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                Terms & Status
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                    Payment Terms *
                  </label>
                  <select
                    name="paymentTerms"
                    value={form.paymentTerms}
                    onChange={onChange}
                    className={inp}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit 15 days">Credit 15 days</option>
                    <option value="Credit 30 days">Credit 30 days</option>
                    <option value="Credit 60 days">Credit 60 days</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={onChange}
                    className={inp}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading
                  ? "Processing..."
                  : mode === "edit"
                    ? "Update"
                    : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SupplierModal;
