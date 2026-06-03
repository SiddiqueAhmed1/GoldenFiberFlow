import mongoose from "mongoose";

const consignmentSchema = mongoose.Schema(
  {
    sender_details: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      mobile: { type: Number, required: true },
    },
    receiver_details: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      mobile: { type: Number, required: true },
    },
    transportation_details: {
      driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
      },
      vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true,
      },
    },
    items: [
      {
        description: { type: String, required: true },
        grade: { type: String, required: true },
        quantity: { type: Number, required: true },
        weight: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "In transit", "Delivered", "Cancelled"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Consignment", consignmentSchema);
