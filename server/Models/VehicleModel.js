import mongoose from "mongoose";

const vehicleSchema = mongoose.Schema(
  {
    plateNumber: { type: String, required: true, trim: true, uppercase: true },
    type: {
      type: String,
      enum: ["Truck", "Mini Truck", "Pickup", "Van", "Container"],
      required: true,
    },
    capacity: { type: String, required: true },
    status: {
      type: String,
      enum: ["Available", "On Trip", "Under Maintenance"],
      default: "Available",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Vehicle", vehicleSchema);
