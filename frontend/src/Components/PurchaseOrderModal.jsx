import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createPurchaseOrder,
  updatePurchaseOrder,
} from "../Services/purchaseOrderService";
import { getSuppliers } from "../Services/supplierService";
import { getProducts } from "../Services/productService";
import { toast } from "react-hot-toast";

const inp =
  "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition";
const roInp = `${inp} bg-neutral-100 dark:bg-neutral-600 cursor-not-allowed`;
const emptyItem = {
  product: "",
  description: "",
  unit: "",
  quantity: "",
  unitPrice: "",
  totalPrice: "",
};
const emptyForm = {
  supplier: "",
  items: [{ ...emptyItem }],
  totalAmount: 0,
  expectedDate: "",
  note: "",
  status: "Pending",
};

const Label = ({ c }) => (
  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
    {c}
  </label>
);
const Section = ({ c }) => (
  <h2 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
    {c}
  </h2>
);
const PurchaseOrderModal = ({ handleClose, setOrders, mode, selected }) => {
  const [form, setForm] = useState(emptyForm);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getSuppliers()
      .then((d) => setSuppliers(d.filter((s) => s.status === "Active")))
      .catch(() => {});
    getProducts()
      .then((d) => setProducts(d.filter((p) => p.status === "Active")))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === "edit" && selected) {
      const d = {
        supplier: selected.supplier?._id || selected.supplier,
        items: selected.items.map((i) => ({
          product: i.product?._id || i.product || "",
          description: i.description,
          unit: i.unit || "",
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.totalPrice,
        })),
        totalAmount: selected.totalAmount,
        expectedDate: selected.expectedDate?.slice(0, 10) || "",
        note: selected.note || "",
        status: selected.status,
      };
      setForm(d);
      setOriginal(d);
    }
  }, [mode, selected]);
  const calcTotal = (items) =>
    items.reduce((acc, i) => acc + (Number(i.totalPrice) || 0), 0);

  const handleProductSelect = (idx, productId) => {
    const product = products.find((p) => p._id === productId);
    const items = [...form.items];
    const qty = Number(items[idx].quantity) || 0;
    items[idx] = {
      ...items[idx],
      product: productId,
      description: product?.name || "",
      unit: product?.unit || "",
      unitPrice: product?.unitPrice || "",
      totalPrice: qty * (product?.unitPrice || 0),
    };
    setForm((p) => ({ ...p, items, totalAmount: calcTotal(items) }));
  };

  const updateItem = (idx, field, val) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [field]: val };
    if (field === "quantity" || field === "unitPrice") {
      items[idx].totalPrice =
        (Number(items[idx].quantity) || 0) *
        (Number(items[idx].unitPrice) || 0);
    }
    setForm((p) => ({ ...p, items, totalAmount: calcTotal(items) }));
  };

  const addItem = () =>
    setForm((p) => ({ ...p, items: [...p.items, { ...emptyItem }] }));
  const removeItem = (idx) => {
    const items = form.items.filter((_, i) => i !== idx);
    setForm((p) => ({ ...p, items, totalAmount: calcTotal(items) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        supplier: form.supplier,
        items: form.items,
        totalAmount: Number(form.totalAmount),
        expectedDate: form.expectedDate,
        note: form.note,
        status: form.status,
      };
      if (mode === "create") {
        const data = await createPurchaseOrder(payload);
        setOrders((p) => [data, ...p]);
        toast.success("Purchase order created successfully");
        handleClose();
      } else {
        if (JSON.stringify(original) === JSON.stringify(form))
          return toast.error("Nothing to update");
        const data = await updatePurchaseOrder(selected._id, payload);
        setOrders((p) => p.map((o) => (o._id === selected._id ? data : o)));
        toast.success("Purchase order updated successfully");
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
      <div className="bg-white dark:bg-neutral-800 w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl mx-4 shadow-2xl">
        <div className="sticky top-0 flex justify-between items-start border-b border-neutral-200 dark:border-neutral-700 p-5 bg-white dark:bg-neutral-800 z-10">
          <div>
            <h1 className="text-lg font-bold text-neutral-800 dark:text-white">
              {mode === "edit"
                ? "Update Purchase Order"
                : "Create Purchase Order"}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Fill in the purchase details
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
            {/* Supplier & Date */}
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4">
              <Section c="Supplier & Date" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label c="Supplier *" />
                  <select
                    required
                    value={form.supplier}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, supplier: e.target.value }))
                    }
                    className={inp}
                  >
                    <option value="">— Select supplier —</option>
                    {suppliers.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label c="Expected Date" />
                  <input
                    type="date"
                    value={form.expectedDate}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, expectedDate: e.target.value }))
                    }
                    className={inp}
                  />
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <Section c="Items" />
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-500 hover:text-amber-600 transition"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>

              <div className="space-y-3">
                {form.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 items-end border-b border-neutral-200 dark:border-neutral-700 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="col-span-5">
                      <Label c="Product *" />
                      <select
                        required
                        value={item.product}
                        onChange={(e) =>
                          handleProductSelect(idx, e.target.value)
                        }
                        className={inp}
                      >
                        <option value="">— Product —</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <Label c="Qty *" />
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(idx, "quantity", e.target.value)
                        }
                        className={inp}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label c="Price *" />
                      <input
                        type="number"
                        required
                        min="0"
                        step="any"
                        placeholder="0"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(idx, "unitPrice", e.target.value)
                        }
                        className={inp}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label c="Total" />
                      <input
                        type="text"
                        readOnly
                        value={item.totalPrice || 0}
                        className={roInp}
                      />
                    </div>
                    <div className="col-span-1 flex justify-center mb-1">
                      {form.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note & Summary & Status */}
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4 space-y-4">
              <div className="grid grid-cols-3 gap-4 items-start">
                <div className="col-span-2">
                  <Label c="Note / Instructions" />
                  <textarea
                    rows={2}
                    placeholder="Any notes..."
                    value={form.note}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, note: e.target.value }))
                    }
                    className={inp + " resize-none"}
                  />
                </div>
                <div>
                  <Label c="Order Status *" />
                  <select
                    required
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, status: e.target.value }))
                    }
                    className={inp}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Received">Received</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end items-center gap-2 border-t border-neutral-200 dark:border-neutral-700 pt-3">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  Total Amount:
                </span>
                <span className="text-2xl font-black text-neutral-800 dark:text-white">
                  ${form.totalAmount || 0}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 rounded-lg shadow-md shadow-amber-500/10 transition"
              >
                {loading
                  ? "Saving..."
                  : mode === "edit"
                    ? "Update Order"
                    : "Create Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PurchaseOrderModal;
