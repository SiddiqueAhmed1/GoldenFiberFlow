import mongoose from "mongoose";

const driverSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: Number, required: true },
    licenseNumber: { type: String, required: true, trim: true },
    licenseExpiry: { type: Date, required: true },
    address: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Available", "On Trip", "Off Duty"],
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

export default mongoose.model("Driver", driverSchema);
