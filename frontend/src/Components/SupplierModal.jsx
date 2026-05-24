import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createSupplier, updateSupplier } from "../Services/supplierService";
import { toast } from "react-hot-toast";

const emptyForm = {
  name: "",
  contactPerson: "",
  mobile: "",
  email: "",
  address: "",
  paymentTerms: "Cash",
  status: "Active",
};

const SupplierModal = ({
  handleClose,
  setSuppliers,
  mode,
  selectedSupplier,
}) => {
  const [formData, setFormData] = useState(emptyForm);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && selectedSupplier) {
      const data = {
        name: selectedSupplier.name,
        contactPerson: selectedSupplier.contactPerson,
        mobile: selectedSupplier.mobile,
        email: selectedSupplier.email,
        address: selectedSupplier.address,
        paymentTerms: selectedSupplier.paymentTerms,
        status: selectedSupplier.status,
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [mode, selectedSupplier]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        const data = await createSupplier(formData);
        if (data) {
          setSuppliers((prev) => [...prev, data]);
          toast.success("Supplier created successfully", {
            duration: 3000,
            position: "top-right",
          });
          handleClose();
        }
      } else if (mode === "edit" && selectedSupplier) {
        if (JSON.stringify(originalData) === JSON.stringify(formData)) {
          return toast.error("Nothing to update", { duration: 1500 });
        }

        const data = await updateSupplier(selectedSupplier._id, formData);
        if (data) {
          setSuppliers((prev) =>
            prev.map((item) =>
              item._id === selectedSupplier._id ? data : item,
            ),
          );
          toast.success("Supplier updated successfully", { duration: 1500 });
          handleClose();
        }
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border w-full";

  return (
    <section className="fixed bg-neutral-800/60 transition top-0 left-0 bottom-0 right-0 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg mx-4">
        {/* modal header */}
        <div className="sticky top-0 flex justify-between border-b border-neutral-300 p-6 z-50 bg-white">
          <div>
            <h1 className="text-sm md:text-xl font-extrabold mb-1">
              {mode === "edit" ? "Update Supplier" : "Add Supplier"}
            </h1>
            <p className="md:text-sm text-xs text-neutral-500">
              {mode === "edit"
                ? "Change one field to update"
                : "Fill in the details to add a new supplier"}
            </p>
          </div>
          <button className="cursor-pointer" onClick={handleClose}>
            <X />
          </button>
        </div>

        {/* form */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Company info */}
            <div className="flex flex-col gap-3 border-b border-neutral-300 pb-5">
              <h2 className="text-[16px] font-semibold text-black mb-1">
                Company Info
              </h2>

              <div className="flex flex-col">
                <label className="text-sm mb-1">Company Name *</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  type="text"
                  placeholder="e.g. Dhaka Textile Ltd."
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-1">Contact Person *</label>
                <input
                  required
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className={inputClass}
                  type="text"
                  placeholder="e.g. Mr. Karim"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-1">Address *</label>
                <input
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                  type="text"
                  placeholder="e.g. 45 Mirpur Road, Dhaka"
                />
              </div>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-3 border-b border-neutral-300 pb-5 mt-5">
              <h2 className="text-[16px] font-semibold text-black mb-1">
                Contact Info
              </h2>

              <div className="flex gap-3">
                <div className="flex flex-col w-full">
                  <label className="text-sm mb-1">Mobile *</label>
                  <input
                    required
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={inputClass}
                    type="number"
                    placeholder="e.g. 01712345678"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="text-sm mb-1">Email *</label>
                  <input
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    type="email"
                    placeholder="e.g. supplier@company.com"
                  />
                </div>
              </div>
            </div>

            {/* Terms & Status */}
            <div className="flex flex-col gap-3 mt-5">
              <h2 className="text-[16px] font-semibold text-black mb-1">
                Terms & Status
              </h2>

              <div className="flex gap-3">
                <div className="flex flex-col w-full">
                  <label className="text-sm mb-1">Payment Terms *</label>
                  <select
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit 15 days">Credit 15 days</option>
                    <option value="Credit 30 days">Credit 30 days</option>
                    <option value="Credit 60 days">Credit 60 days</option>
                  </select>
                </div>

                <div className="flex flex-col w-full">
                  <label className="text-sm mb-1">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-7">
              <button
                type="button"
                onClick={handleClose}
                className="border border-neutral-300 text-sm px-4 py-2 rounded-lg cursor-pointer hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="border bg-blue-600 text-white text-sm px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : mode === "edit"
                    ? "Update Supplier"
                    : "Add Supplier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SupplierModal;
