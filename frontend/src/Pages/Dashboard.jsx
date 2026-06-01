import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ConsignmentModal from "../Components/ConsignmentModal";
import ConsignmentTable from "../Components/ConsignmentTable";
import {
  getConsignments,
  deleteConsignment,
} from "../Services/consignmentService";
import Swal from "sweetalert2";
import { consignmentId } from "../utils/consignmentId";

export const Dashboard = () => {
  const [isCreateConModal, setIsCreateConModal] = useState(false);
  const [isEditConModal, setIsEditConModal] = useState(false);
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [filteredConsignment, setFilteredConsignment] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadConsignments = async () => {
    const data = await getConsignments();
    setConsignments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadConsignments();
  }, []);

  useEffect(() => {
    let filtered = [...consignments];
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.sender_details.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.receiver_details.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          consignmentId(item._id)
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }
    if (statusFilter !== "all")
      filtered = filtered.filter((item) => item.status === statusFilter);
    setFilteredConsignment(filtered);
  }, [searchQuery, consignments, statusFilter]);

  const handleEdit = (c) => {
    setIsEditConModal(true);
    setSelectedConsignment(c);
  };

  const handleDeleteConsignment = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteConsignment(id);
        setConsignments((prev) => prev.filter((item) => item._id !== id));
        Swal.fire("Deleted!", "Consignment has been deleted.", "success");
      }
    });
  };

  const handleClose = () => {
    setIsCreateConModal(false);
    setIsEditConModal(false);
  };

  return (
    <>
      <section className="p-5 md:p-8 min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white">
                Consignments
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                Manage and track all shipment records
              </p>
            </div>
            <button
              onClick={() => setIsCreateConModal(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2.5 rounded-xl font-medium cursor-pointer transition shadow-sm"
            >
              <Plus size={16} /> Create Consignment
            </button>
          </div>

          <ConsignmentTable
            setIsCreateConModal={setIsCreateConModal}
            handleDeleteConsignment={handleDeleteConsignment}
            consignments={consignments}
            loading={loading}
            setConsignments={setConsignments}
            handleEdit={handleEdit}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredConsignment={filteredConsignment}
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
          />
        </div>

        {isCreateConModal && (
          <ConsignmentModal
            handleClose={handleClose}
            setConsignments={setConsignments}
            mode="create"
          />
        )}
        {isEditConModal && (
          <ConsignmentModal
            handleClose={handleClose}
            setIsEditConModal={setIsEditConModal}
            setConsignments={setConsignments}
            mode="edit"
            selectedConsignmnet={selectedConsignment}
          />
        )}
      </section>
    </>
  );
};
