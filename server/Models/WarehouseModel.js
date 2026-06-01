import mongoose from "mongoose";

const warehouseSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    capacity: { type: String, required: true },
    manager: { type: String, required: true, trim: true },
    mobile: { type: Number, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Warehouse", warehouseSchema);
