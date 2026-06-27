import mongoose from "mongoose";

const customerSchema = mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    mobile:       { type: Number, required: true },
    email:        { type: String, trim: true, lowercase: true, default: "" },
    address:      { type: String, required: true, trim: true },
    businessName: { type: String, trim: true, default: "" },
    status:       { type: String, enum: ["Active", "Inactive"], default: "Active" },
    createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
