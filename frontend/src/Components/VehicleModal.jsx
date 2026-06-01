import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createVehicle, updateVehicle } from "../Services/vehicleService";
import { toast } from "react-hot-toast";

const empty = {
  plateNumber: "",
  type: "Truck",
  capacity: "",
  status: "Available",
};
const inp =
  "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 transition";

const VehicleModal = ({ handleClose, setVehicles, mode, selected }) => {
  const [form, setForm] = useState(empty);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && selected) {
      const d = {
        plateNumber: selected.plateNumber,
        type: selected.type,
        capacity: selected.capacity,
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
        const data = await createVehicle(form);
        setVehicles((p) => [...p, data]);
        toast.success("Vehicle created successfully");
        handleClose();
      } else {
        if (JSON.stringify(original) === JSON.stringify(form))
          return toast.error("Nothing to update");
        const data = await updateVehicle(selected._id, form);
        setVehicles((p) => p.map((v) => (v._id === selected._id ? data : v)));
        toast.success("Vehicle updated successfully");
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
      <div className="bg-white dark:bg-neutral-800 w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl mx-4 shadow-2xl">
        <div className="sticky top-0 flex justify-between items-start border-b border-neutral-200 dark:border-neutral-700 p-5 bg-white dark:bg-neutral-800 z-10">
          <div>
            <h1 className="text-lg font-bold text-neutral-800 dark:text-white">
              {mode === "edit" ? "Update Vehicle" : "Add Vehicle"}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {mode === "edit"
                ? "Change one field to update"
                : "Fill in the vehicle details"}
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
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                Plate Number *
              </label>
              <input
                required
                name="plateNumber"
                value={form.plateNumber}
                onChange={onChange}
                className={inp}
                placeholder="e.g. DHAKA-GA-1234"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                  Type *
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={onChange}
                  className={inp}
                >
                  <option value="Truck">Truck</option>
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Van">Van</option>
                  <option value="Container">Container</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                  Capacity *
                </label>
                <input
                  required
                  name="capacity"
                  value={form.capacity}
                  onChange={onChange}
                  className={inp}
                  placeholder="e.g. 5 tons"
                />
              </div>
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
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
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
                    ? "Update Vehicle"
                    : "Add Vehicle"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
export default VehicleModal;
