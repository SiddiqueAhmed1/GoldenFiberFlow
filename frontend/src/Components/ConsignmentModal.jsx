import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createConsignments,
  updateConsignments,
} from "../Services/consignmentService";
import { getDrivers } from "../Services/driverService";
import { getVehicles } from "../Services/vehicleService";
import { toast } from "react-hot-toast";

const inp =
  "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 transition";

const emptyForm = {
  sender_details: { name: "", address: "", mobile: "" },
  receiver_details: { name: "", address: "", mobile: "" },
  transportation_details: { driverId: "", vehicleId: "" },
  items: [{ description: "", grade: "", quantity: "", weight: "", price: "" }],
  status: "Pending",
};

const ConsignmentModal = ({
  handleClose,
  setConsignments,
  mode,
  selectedConsignmnet,
}) => {
  const [formData, setFormData] = useState(emptyForm);
  const [original, setOriginal] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  // load drivers & vehicles for dropdowns
  useEffect(() => {
    getDrivers()
      .then((d) => setDrivers(d.filter((x) => x.status === "Available")))
      .catch(() => {});
    getVehicles()
      .then((v) => setVehicles(v.filter((x) => x.status === "Available")))
      .catch(() => {});
  }, []);

  // populate form in edit mode
  useEffect(() => {
    if (mode === "edit" && selectedConsignmnet) {
      const d = {
        sender_details: selectedConsignmnet.sender_details,
        receiver_details: selectedConsignmnet.receiver_details,
        transportation_details: {
          driverId:
            selectedConsignmnet.transportation_details?.driverId ||
            selectedConsignmnet.transportation_details?.driverName ||
            "",
          vehicleId:
            selectedConsignmnet.transportation_details?.vehicleId ||
            selectedConsignmnet.transportation_details?.trackDetails ||
            "",
        },
        items: selectedConsignmnet.items,
        status: selectedConsignmnet.status,
      };
      setFormData(d);
      setOriginal(d);
    }
  }, [mode, selectedConsignmnet]);

  // nested sender/receiver updater
  const setSender = (field, val) =>
    setFormData((p) => ({
      ...p,
      sender_details: { ...p.sender_details, [field]: val },
    }));
  const setReceiver = (field, val) =>
    setFormData((p) => ({
      ...p,
      receiver_details: { ...p.receiver_details, [field]: val },
    }));
  const setTransport = (field, val) =>
    setFormData((p) => ({
      ...p,
      transportation_details: { ...p.transportation_details, [field]: val },
    }));

  // items
  const addItem = () =>
    setFormData((p) => ({
      ...p,
      items: [
        ...p.items,
        { description: "", grade: "", quantity: "", weight: "", price: "" },
      ],
    }));
  const removeItem = (i) =>
    setFormData((p) => ({
      ...p,
      items: p.items.filter((_, idx) => idx !== i),
    }));
  const updateItem = (i, field, val) => {
    const items = [...formData.items];
    items[i] = { ...items[i], [field]: val };
    setFormData((p) => ({ ...p, items }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "create") {
        const data = await createConsignments(
          formData.sender_details,
          formData.receiver_details,
          formData.transportation_details,
          formData.items,
          formData.status,
        );
        if (data) {
          setConsignments((p) => [...p, data]);
          toast.success("Consignment created successfully", {
            duration: 3000,
            position: "top-right",
          });
          handleClose();
        }
      } else {
        if (JSON.stringify(original) === JSON.stringify(formData))
          return toast.error("Nothing to update", { duration: 1500 });
        const data = await updateConsignments(
          selectedConsignmnet._id,
          formData,
        );
        if (data) {
          setConsignments((p) =>
            p.map((item) =>
              item._id === selectedConsignmnet._id ? data : item,
            ),
          );
          toast.success("Consignment updated successfully", { duration: 1500 });
          handleClose();
        }
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const SectionTitle = ({ children }) => (
    <h2 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
      {children}
    </h2>
  );

  const Label = ({ children }) => (
    <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
      {children}
    </label>
  );

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-800 w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl mx-4 shadow-2xl">
        {/* header */}
        <div className="sticky top-0 flex justify-between items-start border-b border-neutral-200 dark:border-neutral-700 p-5 bg-white dark:bg-neutral-800 z-10">
          <div>
            <h1 className="text-lg font-bold text-neutral-800 dark:text-white">
              {mode === "edit" ? "Update Consignment" : "Create Consignment"}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {mode === "edit"
                ? "Change one field to update"
                : "Fill in the details to create a new consignment"}
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Sender ── */}
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4">
              <SectionTitle>Sender Details</SectionTitle>
              <div className="space-y-3">
                <div>
                  <Label>Name *</Label>
                  <input
                    required
                    value={formData.sender_details.name}
                    onChange={(e) => setSender("name", e.target.value)}
                    className={inp}
                    placeholder="Sender full name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Mobile *</Label>
                    <input
                      required
                      value={formData.sender_details.mobile}
                      onChange={(e) => setSender("mobile", e.target.value)}
                      className={inp}
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                  <div>
                    <Label>Address *</Label>
                    <input
                      required
                      value={formData.sender_details.address}
                      onChange={(e) => setSender("address", e.target.value)}
                      className={inp}
                      placeholder="City, District"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Receiver ── */}
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4">
              <SectionTitle>Receiver Details</SectionTitle>
              <div className="space-y-3">
                <div>
                  <Label>Name *</Label>
                  <input
                    required
                    value={formData.receiver_details.name}
                    onChange={(e) => setReceiver("name", e.target.value)}
                    className={inp}
                    placeholder="Receiver full name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Mobile *</Label>
                    <input
                      required
                      value={formData.receiver_details.mobile}
                      onChange={(e) => setReceiver("mobile", e.target.value)}
                      className={inp}
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                  <div>
                    <Label>Address *</Label>
                    <input
                      required
                      value={formData.receiver_details.address}
                      onChange={(e) => setReceiver("address", e.target.value)}
                      className={inp}
                      placeholder="City, District"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Transportation ── */}
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4">
              <SectionTitle>Transportation Details</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Driver *</Label>
                  <select
                    required
                    value={formData.transportation_details.driverId}
                    onChange={(e) => setTransport("driverId", e.target.value)}
                    className={inp}
                  >
                    <option value="">— Select driver —</option>
                    {drivers.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} · {d.licenseNumber}
                      </option>
                    ))}
                  </select>
                  {drivers.length === 0 && (
                    <p className="text-xs text-amber-500 mt-1">
                      No available drivers. Add drivers first.
                    </p>
                  )}
                </div>
                <div>
                  <Label>Vehicle *</Label>
                  <select
                    required
                    value={formData.transportation_details.vehicleId}
                    onChange={(e) => setTransport("vehicleId", e.target.value)}
                    className={inp}
                  >
                    <option value="">— Select vehicle —</option>
                    {vehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.plateNumber} · {v.type}
                      </option>
                    ))}
                  </select>
                  {vehicles.length === 0 && (
                    <p className="text-xs text-amber-500 mt-1">
                      No available vehicles. Add vehicles first.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Items ── */}
            <div className="bg-neutral-50 dark:bg-neutral-700/30 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <SectionTitle>Items</SectionTitle>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer transition"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                        Item {index + 1}
                      </span>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 cursor-pointer transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label>Description *</Label>
                        <input
                          required
                          value={item.description}
                          onChange={(e) =>
                            updateItem(index, "description", e.target.value)
                          }
                          className={inp}
                          placeholder="e.g. Jute Fiber"
                        />
                      </div>
                      <div>
                        <Label>Grade *</Label>
                        <input
                          required
                          value={item.grade}
                          onChange={(e) =>
                            updateItem(index, "grade", e.target.value)
                          }
                          className={inp}
                          placeholder="e.g. Grade A"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Quantity *</Label>
                        <input
                          required
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(index, "quantity", e.target.value)
                          }
                          className={inp}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>Weight (kg) *</Label>
                        <input
                          required
                          type="number"
                          value={item.weight}
                          onChange={(e) =>
                            updateItem(index, "weight", e.target.value)
                          }
                          className={inp}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>Price (৳) *</Label>
                        <input
                          required
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(index, "price", e.target.value)
                          }
                          className={inp}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Status ── */}
            <div>
              <Label>Status *</Label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, status: e.target.value }))
                }
                className={inp}
              >
                <option value="Pending">Pending</option>
                <option value="In transit">In transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* ── Actions ── */}
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
                    ? "Update Consignment"
                    : "Create Consignment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ConsignmentModal;
