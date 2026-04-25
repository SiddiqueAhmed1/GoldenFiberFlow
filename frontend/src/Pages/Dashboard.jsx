import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import ConsignmentModal from "../Components/ConsignmentModal";
import ConsignmentTable from "../Components/ConsignmentTable";
import { getConsignments } from "../Services/consignmentService";
import { deleteConsignment } from "../Services/consignmentService";
import Swal from "sweetalert2";
import { consignmentId } from "../utils/consignmentId";

export const Dashboard = () => {
  const [isCreateConModal, setIsCreateConModal] = useState(false);
  const [isEditConModal, setIsEditConModal] = useState(false);
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsignmnet, setSelectedConsignment] = useState(null);
  const [filteredConsignment, setFilteredConsignment] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // get consignments
  const loadConsignments = async () => {
    const data = await getConsignments();
    setConsignments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadConsignments();
  }, []);

  useEffect(() => {
    filterConsignment();
  }, [searchQuery, consignments, statusFilter]);

  // filter consignment
  const filterConsignment = () => {
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
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    setFilteredConsignment(filtered);
  };

  // handle edit
  const handleEdit = (consignment) => {
    setIsEditConModal(true);
    setSelectedConsignment(consignment);
  };

  // consginment delete
  const handleDeleteConsignment = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteConsignment(id);
        consignments.filter((item) => item._id !== id);
        loadConsignments();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  // hanlde modal close
  const handleClose = () => {
    setIsCreateConModal(false);
    setIsEditConModal(false);
  };

  return (
    <>
      <section className="bg-neutral-50 min-h-205">
        <div className="max-w-360 mx-auto">
          <div className="flex justify-between items-center py-5 md:py-10 mx-3">
            <div className=" flex flex-col gap-1">
              <h1 className="md:text-4xl text-xl font-bold">Consignments</h1>
              <p className="text-neutral-600 text-sm md:text-lg">
                Manage and track all your consignment records
              </p>
            </div>
            <div>
              <button
                onClick={() => setIsCreateConModal((prev) => !prev)}
                className="flex items-center md:gap-1 border bg-blue-600 text-white text-sm md:text-lg px-2 md:px-3 py-1 md:py-3 rounded-md cursor-pointer hover:bg-blue-700"
              >
                <Plus /> Create Consignment
              </button>
            </div>
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

        {/* consignment create modal */}
        {isCreateConModal && (
          <ConsignmentModal
            handleClose={handleClose}
            setConsignments={setConsignments}
            mode="create"
          />
        )}

        {/* consignment edit modal */}
        {isEditConModal && (
          <ConsignmentModal
            handleClose={handleClose}
            setIsEditConModal={setIsEditConModal}
            setConsignments={setConsignments}
            mode="edit"
            selectedConsignmnet={selectedConsignmnet}
          />
        )}
      </section>
    </>
  );
};
