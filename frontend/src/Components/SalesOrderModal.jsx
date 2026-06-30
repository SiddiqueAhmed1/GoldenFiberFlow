import { Plus, Trash2, X, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createSalesOrder,
  updateSalesOrder,
} from "../Services/salesOrderService";
import { getCustomers } from "../Services/customerService";
import { getProducts } from "../Services/productService";
import { getDrivers } from "../Services/driverService";
import { getVehicles } from "../Services/vehicleService";
import { getWarehouses } from "../Services/warehouseService";
import { toast } from "react-hot-toast";

const inp =
  "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition";
const roInp = `${inp} bg-neutral-100 dark:bg-neutral-600 cursor-not-allowed`;

const emptyItem = {
  product: "",
  description: "",
  grade: "",
  unit: "",
  quantity: "",
  unitPrice: "",
  totalPrice: "",
};
const emptyDispatch = { driver: "", vehicle: "", warehouse: "" };
const emptyForm = {
  customer: "",
  items: [{ ...emptyItem }],
  totalAmount: 0,
  advanceAmount: "",
  note: "",
  status: "Pending",
  dispatchDetails: { ...emptyDispatch },
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

const DISPATCH_STATUSES = ["In Transit", "Delivered"];
const SalesOrderModal = ({ handleClose, setOrders, mode, selected }) => {
  const [form, setForm] = useState(emptyForm);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    getCustomers()
      .then((d) => setCustomers(d.filter((c) => c.status === "Active")))
      .catch(() => {});
    getProducts()
      .then((d) => setProducts(d.filter((p) => p.status === "Active")))
      .catch(() => {});
    getDrivers()
      .then((d) => setDrivers(d.filter((dr) => dr.status === "Available")))
      .catch(() => {});
    getVehicles()
      .then((d) => setVehicles(d.filter((v) => v.status === "Available")))
      .catch(() => {});
    getWarehouses()
      .then((d) => setWarehouses(d.filter((w) => w.status === "Active")))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === "edit" && selected) {
      const d = {
        customer: selected.customer?._id || selected.customer,
        items: selected.items.map((i) => ({
          product: i.product?._id || i.product || "",
          description: i.description,
          grade: i.grade,
          unit: i.unit || "",
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.totalPrice,
        })),
        totalAmount: selected.totalAmount,
        advanceAmount: selected.advanceAmount,
        note: selected.note || "",
        status: selected.status,
        dispatchDetails: {
          driver:
            selected.dispatchDetails?.driver?._id ||
            selected.dispatchDetails?.driver ||
            "",
          vehicle:
            selected.dispatchDetails?.vehicle?._id ||
            selected.dispatchDetails?.vehicle ||
            "",
          warehouse:
            selected.dispatchDetails?.warehouse?._id ||
            selected.dispatchDetails?.warehouse ||
            "",
        },
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
      grade: product?.grade || "",
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

  const setDispatch = (field, val) =>
    setForm((p) => ({
      ...p,
      dispatchDetails: { ...p.dispatchDetails, [field]: val },
    }));

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
      const showDispatch = DISPATCH_STATUSES.includes(form.status);
      const payload = {
        ...form,
        items: form.items.map(
          ({
            product,
            description,
            grade,
            quantity,
            unitPrice,
            totalPrice,
          }) => ({
            product,
            description,
            grade,
            quantity,
            unitPrice,
            totalPrice,
          }),
        ),
        totalAmount: Number(form.totalAmount),
        advanceAmount: Number(form.advanceAmount) || 0,
        dispatchDetails: showDispatch
          ? {
              driver: form.dispatchDetails.driver || null,
              vehicle: form.dispatchDetails.vehicle || null,
              warehouse: form.dispatchDetails.warehouse || null,
            }
          : { driver: null, vehicle: null, warehouse: null },
      };
      if (mode === "create") {
        const data = await createSalesOrder(payload);
        setOrders((p) => [data, ...p]);
        toast.success("Sales order created & invoice generated automatically");
        handleClose();
      } else {
        const data = await updateSalesOrder(selected._id, payload);
        setOrders((p) => p.map((o) => (o._id === selected._id ? data : o)));
        toast.success("Sales order updated successfully");
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
              {mode === "edit" ? "Update Sales Order" : "Create Sales Order"}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Invoice will be generated automatically
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
            {/* Customer */}
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4">
              <Section c="Customer" />
              <div>
                <Label c="Customer *" />
                <select
                  required
                  value={form.customer}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, customer: e.target.value }))
                  }
                  className={inp}
                >
                  <option value="">— Select customer —</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                      {c.businessName ? ` · ${c.businessName}` : ""}
                    </option>
                  ))}
                </select>
                {customers.length === 0 && (
                  <p className="text-xs text-amber-500 mt-1">
                    No active customers. Add a customer first.
                  </p>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <Section c="Items" />
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 cursor-pointer transition"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>
              <div className="space-y-3">
                {form.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                        Item {idx + 1}
                      </span>
                      {form.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {products.length > 0 && (
                      <div className="mb-3">
                        <Label c="Select Product (auto-fills details below)" />
                        <select
                          value={item.product}
                          onChange={(e) =>
                            handleProductSelect(idx, e.target.value)
                          }
                          className={inp}
                        >
                          <option value="">— Pick a product —</option>
                          {products.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name} · {p.grade} · ৳{p.unitPrice}/{p.unit}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label c="Description *" />
                        <input
                          required
                          value={item.description}
                          onChange={(e) =>
                            updateItem(idx, "description", e.target.value)
                          }
                          className={inp}
                          placeholder="e.g. Jute Fiber"
                        />
                      </div>
                      <div>
                        <Label c="Grade *" />
                        <input
                          required
                          value={item.grade}
                          onChange={(e) =>
                            updateItem(idx, "grade", e.target.value)
                          }
                          className={inp}
                          placeholder="e.g. Grade A"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label c={`Quantity (${item.unit || "pcs"}) *`} />
                        <input
                          required
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(idx, "quantity", e.target.value)
                          }
                          className={inp}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label c={`Unit Price / ${item.unit || "pcs"} (৳) *`} />
                        <input
                          required
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(idx, "unitPrice", e.target.value)
                          }
                          className={inp}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label c="Total (৳)" />
                        <input
                          readOnly
                          value={item.totalPrice || 0}
                          className={roInp}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Payment & Status */}
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4">
              <Section c="Payment & Status" />
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <Label c="Total Amount (৳)" />
                  <input
                    readOnly
                    value={form.totalAmount || 0}
                    className={roInp}
                  />
                </div>
                <div>
                  <Label c="Advance Received (৳)" />
                  <input
                    type="number"
                    min="0"
                    value={form.advanceAmount}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, advanceAmount: e.target.value }))
                    }
                    className={inp}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label c="Due Amount (৳)" />
                  <input
                    readOnly
                    value={
                      (Number(form.totalAmount) || 0) -
                      (Number(form.advanceAmount) || 0)
                    }
                    className={roInp}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label c="Status *" />
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, status: e.target.value }))
                    }
                    className={inp}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <Label c="Note" />
                  <input
                    value={form.note}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, note: e.target.value }))
                    }
                    className={inp}
                    placeholder="Optional note"
                  />
                </div>
              </div>
            </div>

            {/* Dispatch Info — only when In Transit or Delivered */}
            {DISPATCH_STATUSES.includes(form.status) && (
              <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Truck
                    size={14}
                    className="text-violet-600 dark:text-violet-400"
                  />
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Dispatch Info
                  </span>
                </div>
                <p className="text-xs text-violet-600 dark:text-violet-400 mb-3 -mt-2">
                  Assign driver, vehicle and source warehouse for this shipment.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label c="Driver" />
                    <select
                      value={form.dispatchDetails?.driver || ""}
                      onChange={(e) => setDispatch("driver", e.target.value)}
                      className={inp}
                    >
                      <option value="">— Select driver —</option>
                      {drivers.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name} · {d.mobile}
                        </option>
                      ))}
                    </select>
                    {drivers.length === 0 && (
                      <p className="text-xs text-amber-500 mt-1">
                        No available drivers. Check Driver management.
                      </p>
                    )}
                  </div>
                  <div>
                    <Label c="Vehicle" />
                    <select
                      value={form.dispatchDetails?.vehicle || ""}
                      onChange={(e) => setDispatch("vehicle", e.target.value)}
                      className={inp}
                    >
                      <option value="">— Select vehicle —</option>
                      {vehicles.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.plateNumber} · {v.type} · {v.capacity}
                        </option>
                      ))}
                    </select>
                    {vehicles.length === 0 && (
                      <p className="text-xs text-amber-500 mt-1">
                        No available vehicles. Check Vehicle management.
                      </p>
                    )}
                  </div>
                  <div>
                    <Label c="Warehouse" />
                    <select
                      value={form.dispatchDetails?.warehouse || ""}
                      onChange={(e) => setDispatch("warehouse", e.target.value)}
                      className={inp}
                    >
                      <option value="">— Select warehouse —</option>
                      {warehouses.map((w) => (
                        <option key={w._id} value={w._id}>
                          {w.name} · {w.location}
                        </option>
                      ))}
                    </select>
                    {warehouses.length === 0 && (
                      <p className="text-xs text-amber-500 mt-1">
                        No active warehouses. Check Warehouse management.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

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

export default SalesOrderModal;
