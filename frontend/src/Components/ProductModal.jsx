import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createProduct, updateProduct } from "../Services/productService";
import { toast } from "react-hot-toast";

const empty = {
  name: "",
  sku: "",
  grade: "",
  unitPrice: "",
  unit: "kg",
  status: "Active",
};
const inp =
  "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition";

const ProductModal = ({ handleClose, setProducts, mode, selected }) => {
  const [form, setForm] = useState(empty);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && selected) {
      const d = {
        name: selected.name,
        sku: selected.sku,
        grade: selected.grade,
        unitPrice: selected.unitPrice,
        unit: selected.unit,
        status: selected.status,
      };
      setForm(d);
      setOriginal(d);
    }
  }, [mode, selected]);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "create") {
        const data = await createProduct(form);
        setProducts((p) => [...p, data]);
        toast.success("Product created successfully");
        handleClose();
      } else {
        if (JSON.stringify(original) === JSON.stringify(form))
          return toast.error("Nothing to update");
        const data = await updateProduct(selected._id, form);
        setProducts((p) =>
          p.map((item) => (item._id === selected._id ? data : item)),
        );
        toast.success("Product updated successfully");
        handleClose();
      }
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
            <h1 className="text-lg font-bold text-neutral-800 dark:text-white">
              {mode === "edit" ? "Update Product" : "Add Product"}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {mode === "edit"
                ? "Change one field to update"
                : "Fill in the product details"}
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
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Product Info
              </h2>
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                  Product Name *
                </label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className={inp}
                  placeholder="e.g. Golden Jute Fiber"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                    SKU *
                  </label>
                  <input
                    required
                    name="sku"
                    value={form.sku}
                    onChange={onChange}
                    className={inp}
                    placeholder="e.g. GJF-001"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                    Grade *
                  </label>
                  <input
                    required
                    name="grade"
                    value={form.grade}
                    onChange={onChange}
                    className={inp}
                    placeholder="e.g. Grade A"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <h2 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Pricing & Unit
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                    Unit Price (৳) *
                  </label>
                  <input
                    required
                    name="unitPrice"
                    value={form.unitPrice}
                    onChange={onChange}
                    className={inp}
                    type="number"
                    placeholder="e.g. 5000"
                  />
                  {form.unit && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      ৳ {form.unitPrice || 0} / {form.unit}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                    Unit *
                  </label>
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={onChange}
                    className={inp}
                  >
                    <option value="kg">kg</option>
                    <option value="ton">ton</option>
                    <option value="bale">bale</option>
                    <option value="piece">piece</option>
                    <option value="bundle">bundle</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <h2 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Status
              </h2>
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

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium cursor-pointer transition disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : mode === "edit"
                    ? "Update Product"
                    : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProductModal;
