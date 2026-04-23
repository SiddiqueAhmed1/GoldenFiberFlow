import { EyeClosedIcon, Plus, Trash, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  createConsignments,
  updateConsignments,
} from "../Services/consignmentService";
import { toast } from "react-hot-toast";

const ConsignmentModal = ({
  handleClose,
  setConsignments,
  mode,
  selectedConsignmnet,
}) => {
  const [formData, setFormData] = useState({
    sender_details: {
      name: "",
      address: "",
      mobile: "",
    },
    receiver_details: {
      name: "",
      address: "",
      mobile: "",
    },
    transportation_details: {
      trackDetails: "",
      driverName: "",
    },
    items: [
      {
        description: "",
        grade: "",
        quantity: "",
        weight: "",
        price: "",
      },
    ],
    status: "Pending",
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const initForm = () => {
      if (mode === "edit" && selectedConsignmnet) {
        const data = {
          sender_details: selectedConsignmnet?.sender_details,
          receiver_details: selectedConsignmnet?.receiver_details,
          transportation_details: selectedConsignmnet?.transportation_details,
          items: selectedConsignmnet?.items,
          status: selectedConsignmnet?.status,
        };
        setFormData(data);
        setOriginalData(data);
      }
    };
    initForm();
  }, [mode, selectedConsignmnet]);

  // add item
  const addItemBox = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", grade: "", quantity: "", weight: "", price: "" },
      ],
    }));
  };

  // update item fileds
  const updateItemField = (index, field, value) => {
    const newItem = [...formData.items];
    newItem[index] = { ...newItem[index], [field]: value };
    setFormData({ ...formData, items: newItem });
  };

  // consignment form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "create") {
      const data = await createConsignments(
        formData.sender_details,
        formData.receiver_details,
        formData.transportation_details,
        formData.items,
        formData.status,
      );

      if (data) {
        setConsignments((prev) => [...prev, data]);
        toast.success("Consignments added succesfull", {
          duration: 3000,
          position: "top-right",
        });
        handleClose();
      }
    } else if (mode === "edit" && selectedConsignmnet) {
      if (JSON.stringify(originalData) === JSON.stringify(formData)) {
        return toast.error("Nothing to update", {
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
          },
        });
      }

      const data = await updateConsignments(selectedConsignmnet._id, formData);

      if (data) {
        setConsignments((prev) =>
          prev.map((item) =>
            item._id === selectedConsignmnet._id ? data : item,
          ),
        );
        toast.success("Consignments updated succesfull", {
          duration: 1500,
        });
        handleClose();
      }
    }

    // reset form after submit
    setFormData({
      sender_details: {
        name: "",
        address: "",
        mobile: "",
      },
      receiver_details: {
        name: "",
        address: "",
        mobile: "",
      },
      transportation_details: {
        trackDetails: "",
        driverName: "",
      },
      items: [
        {
          description: "",
          grade: "",
          quantity: "",
          weight: "",
          price: "",
        },
      ],
      status: "Pending",
    });
  };

  return (
    <>
      {/* backdrop TODO:*/}
      <section className="fixed bg-neutral-800/60 transition top-0 left-0 bottom-0 right-0 flex justify-center items-center ">
        {/* modal FIXME:*/}
        <div className="bg-white w-full max-w-200 max-h-[79vh] md:mt-20 overflow-y-auto rounded-lg mx-4">
          {/* modal header TODO: */}
          <div className="sticky top-0 flex justify-between border-b border-neutral-300 p-6 z-50 bg-white">
            <div>
              <h1 className="text-sm md:text-xl font-extrabold mb-1">
                {mode === "edit" ? "Update Consignment" : "Create Consignment"}
              </h1>
              <p className="md:text-sm text-xs">
                {mode === "edit"
                  ? "Change one of field to update"
                  : "Fill in the details to create a new consignment"}
              </p>
            </div>
            <button className="cursor-pointer" onClick={() => handleClose()}>
              <X />
            </button>
          </div>

          {/* consignment form FIXME:*/}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* sender input TODO:*/}
              <div className="flex flex-col gap-3 border-b border-neutral-300 pb-5">
                <h1 className=" text-[18px] text-black mb-2">Sender Details</h1>
                <div className="flex flex-col">
                  <label htmlFor="senderName" className="text-sm! mb-1">
                    Name *
                  </label>
                  <input
                    required={true}
                    name="senderName"
                    value={formData?.sender_details?.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sender_details: {
                          ...prev.sender_details,
                          name: e.target.value,
                        },
                      }))
                    }
                    className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                    type="text"
                    id="senderName"
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="senderAddress" className="text-sm! mb-1">
                    Address *
                  </label>
                  <input
                    required={true}
                    name="senderAddress"
                    value={formData?.sender_details?.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sender_details: {
                          ...prev.sender_details,
                          address: e.target.value,
                        },
                      }))
                    }
                    className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                    type="text"
                    id="senderAddress"
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="senderMobile" className="text-sm! mb-1">
                    Mobile *
                  </label>
                  <input
                    required={true}
                    name="senderMobile"
                    value={formData?.sender_details?.mobile}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sender_details: {
                          ...prev.sender_details,
                          mobile: e.target.value,
                        },
                      }))
                    }
                    className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                    type="text"
                    id="senderMobile"
                  />
                </div>
              </div>

              {/* receiver input FIXME:*/}
              <div className="flex flex-col gap-3 border-b border-neutral-300 pb-5 mt-5">
                <h1 className="text-[18px] text-black mb-2">
                  Receiver Details
                </h1>
                <div className="flex flex-col">
                  <label htmlFor="senderName" className="text-sm! mb-1">
                    Name *
                  </label>
                  <input
                    required={true}
                    name="receiverName"
                    value={formData.receiver_details.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        receiver_details: {
                          ...prev.receiver_details,
                          name: e.target.value,
                        },
                      }))
                    }
                    className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                    type="text"
                    id="senderName"
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="senderAddress" className="text-sm! mb-1">
                    Address *
                  </label>
                  <input
                    required={true}
                    name="receiverAddress"
                    value={formData.receiver_details.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        receiver_details: {
                          ...prev.receiver_details,
                          address: e.target.value,
                        },
                      }))
                    }
                    className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                    type="text"
                    id="senderAddress"
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="senderMobile" className="text-sm! mb-1">
                    Mobile *
                  </label>
                  <input
                    required={true}
                    name="receiverMobile"
                    value={formData.receiver_details.mobile}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        receiver_details: {
                          ...prev.receiver_details,
                          mobile: e.target.value,
                        },
                      }))
                    }
                    className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                    type="text"
                    id="senderMobile"
                  />
                </div>
              </div>
              {/* transportation details FIXME:*/}
              <div className="flex flex-col gap-3 border-b border-neutral-300 pb-5 mt-5">
                <h1 className="text-[18px] text-black mb-2">
                  Transportation Details
                </h1>
                <div className="flex flex-col">
                  <label htmlFor="trackDetails" className="text-sm! mb-1">
                    Vehicles description / Track no. *
                  </label>
                  <input
                    required={true}
                    name="trackDetails"
                    value={formData?.transportation_details?.trackDetails}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        transportation_details: {
                          ...prev.transportation_details,
                          trackDetails: e.target.value,
                        },
                      }))
                    }
                    className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                    type="text"
                    id="trackDetails"
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="driverName" className="text-sm! mb-1">
                    Driver Name *
                  </label>
                  <input
                    required={true}
                    name="driverName"
                    value={formData?.transportation_details?.driverName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        transportation_details: {
                          ...prev.transportation_details,
                          driverName: e.target.value,
                        },
                      }))
                    }
                    className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                    type="text"
                    id="driverName"
                  />
                </div>
              </div>

              {/* items TODO:*/}
              <div className="flex flex-col gap-3 border-b border-neutral-300 pb-5 mt-6">
                {/* item header FIXME:*/}
                <div className="flex justify-between items-center">
                  <h1 className="text-[18px] text-black mb-2">Items</h1>
                  <button
                    type="button"
                    onClick={addItemBox}
                    className="flex items-center md:gap-1 border  text-black text-sm px-2 py-1 rounded-md cursor-pointer hover:bg-neutral-100"
                  >
                    <Plus /> Add Item
                  </button>
                </div>
                {/* item box TODO:*/}
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="border border-neutral-300 rounded-lg p-4 mb-3"
                  >
                    <div className="flex justify-between items-center gap-3 ">
                      <div className="flex flex-col mb-4 w-30 md:w-full ">
                        <label htmlFor="quantity" className="text-sm! mb-1">
                          Description *
                        </label>
                        <input
                          required={true}
                          name="quantity"
                          value={item?.description}
                          onChange={(e) =>
                            updateItemField(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                          type="text"
                          id="quantity"
                        />
                      </div>
                      <div className="flex flex-col mb-4 w-30 md:w-full ">
                        <label htmlFor="grade" className="text-sm! mb-1">
                          Grade *
                        </label>
                        <input
                          required={true}
                          name="grade"
                          value={item?.grade}
                          onChange={(e) =>
                            updateItemField(index, "grade", e.target.value)
                          }
                          className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                          type="text"
                          id="grade"
                        />
                      </div>
                    </div>
                    {/* quantity & weight */}
                    <div className="flex justify-between items-center gap-3 ">
                      <div className="flex flex-col mb-4 w-30 md:w-full ">
                        <label htmlFor="quantity" className="text-sm! mb-1">
                          Quantity *
                        </label>
                        <input
                          required={true}
                          name="quantity"
                          value={item?.quantity}
                          onChange={(e) =>
                            updateItemField(index, "quantity", e.target.value)
                          }
                          className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                          type="number"
                          id="quantity"
                        />
                      </div>
                      <div className="flex flex-col mb-4 w-30 md:w-full ">
                        <label htmlFor="weight" className="text-sm! mb-1">
                          Weight * kg
                        </label>
                        <input
                          required={true}
                          name="weight"
                          value={item?.weight}
                          onChange={(e) =>
                            updateItemField(index, "weight", e.target.value)
                          }
                          className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                          type="number"
                          id="weight"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col mb-4 ">
                      <label htmlFor="price" className="text-sm! mb-1">
                        Price *
                      </label>
                      <input
                        required={true}
                        name="price"
                        value={item?.price}
                        onChange={(e) =>
                          updateItemField(index, "price", e.target.value)
                        }
                        className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                        type="number"
                        id="price"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col my-4">
                <label htmlFor="status" className="text-sm! mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  name="status"
                  className="outline-0 focus-within:outline-2 focus-within:outline-blue-500 rounded-md py-2 px-2 border-neutral-300 border"
                  id="status"
                >
                  <option value="Pending">Pending</option>
                  <option value="In transit">In transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-7">
                <button
                  type="button"
                  onClick={() => handleClose()}
                  className=" border border-neutral-300 text-xs md:text-sm px-2 md:px-3 py-1 md:py-3 rounded-lg cursor-pointer "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className=" border bg-blue-600 text-white text-xs md:text-sm px-3 py-3 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  {mode === "edit"
                    ? "Update Consignment"
                    : "Create Consignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConsignmentModal;
