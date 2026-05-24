import { Plus, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import SupplierModal from "../Components/SupplierModal";
import { getSuppliers, deleteSupplier } from "../Services/supplierService";
import LoadingSpinner from "../Components/LoadingSpinner";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // load suppliers
  const loadSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // filter suppliers by search
  useEffect(() => {
    let filtered = [...suppliers];
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    setFilteredSuppliers(filtered);
  }, [searchQuery, suppliers]);

  // handle edit
  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModal(true);
  };

  // handle delete
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSupplier(id);
          setSuppliers((prev) => prev.filter((s) => s._id !== id));
          Swal.fire("Deleted!", "Supplier has been deleted.", "success");
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  };

  // close modals
  const handleClose = () => {
    setIsCreateModal(false);
    setIsEditModal(false);
    setSelectedSupplier(null);
  };

  const statusBadge = (status) =>
    status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-600";

  const paymentBadge = () => "bg-blue-50 text-blue-600";

  return (
    <>
      <section className="bg-neutral-50 min-h-screen">
        <div className="max-w-360 mx-auto">
          {/* page header */}
          <div className="flex justify-between items-center py-5 md:py-10 mx-3">
            <div className="flex flex-col gap-1">
              <h1 className="md:text-4xl text-xl font-bold">Suppliers</h1>
              <p className="text-neutral-600 text-sm md:text-lg">
                Manage all your supplier records
              </p>
            </div>
            <button
              onClick={() => setIsCreateModal(true)}
              className="flex items-center md:gap-1 border bg-blue-600 text-white text-sm md:text-lg px-2 md:px-3 py-1 md:py-3 rounded-md cursor-pointer hover:bg-blue-700"
            >
              <Plus /> Add Supplier
            </button>
          </div>

          {/* search bar */}
          <div className="mx-3 mb-4">
            <input
              type="text"
              placeholder="Search by name, contact person, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-96 outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-3 border-neutral-300 border text-sm"
            />
          </div>

          {/* table */}
          <div className="mx-3 bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="text-center py-20 text-neutral-400">
                <p className="text-lg font-medium">No suppliers found</p>
                <p className="text-sm mt-1">
                  {searchQuery
                    ? "Try a different search term"
                    : "Click 'Add Supplier' to get started"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 text-left">
                      <th className="px-4 py-3 text-black uppercase">#</th>
                      <th className="px-4 py-3 text-black uppercase">
                        Company
                      </th>
                      <th className="px-4 py-3 text-black uppercase">
                        Contact Person
                      </th>
                      <th className="px-4 py-3 text-black uppercase">Mobile</th>
                      <th className="px-4 py-3 text-black uppercase">Email</th>
                      <th className="px-4 py-3 text-black uppercase">
                        Payment Terms
                      </th>
                      <th className="px-4 py-3 text-black uppercase">Status</th>
                      <th className="px-4 py-3 text-black uppercase text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map((supplier, index) => (
                      <tr
                        key={supplier._id}
                        className="border-b border-neutral-100 hover:bg-neutral-50 transition"
                      >
                        <td className="px-4 py-3 text-neutral-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-neutral-800">
                          {supplier.name}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">
                          {supplier.contactPerson}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">
                          {supplier.mobile}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">
                          {supplier.email}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${paymentBadge()}`}
                          >
                            {supplier.paymentTerms}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(supplier.status)}`}
                          >
                            {supplier.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(supplier)}
                              className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 cursor-pointer transition"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(supplier._id)}
                              className="p-1.5 rounded-md hover:bg-red-50 text-red-500 cursor-pointer transition"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* summary footer */}
          {!loading && suppliers.length > 0 && (
            <p className="mx-3 mt-3 text-xs text-neutral-400">
              Showing {filteredSuppliers.length} of {suppliers.length} suppliers
            </p>
          )}
        </div>
      </section>

      {/* create modal */}
      {isCreateModal && (
        <SupplierModal
          handleClose={handleClose}
          setSuppliers={setSuppliers}
          mode="create"
        />
      )}

      {/* edit modal */}
      {isEditModal && selectedSupplier && (
        <SupplierModal
          handleClose={handleClose}
          setSuppliers={setSuppliers}
          mode="edit"
          selectedSupplier={selectedSupplier}
        />
      )}
    </>
  );
};

export default Suppliers;
