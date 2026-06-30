import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    sku:       { type: String, required: true, trim: true, uppercase: true },
    grade:     { type: String, required: true, trim: true },
    unitPrice: { type: Number, required: true },
    unit: {
      type: String,
      enum: ["kg", "ton", "bale", "piece", "bundle"],
      default: "kg",
    },
    status:    { type: String, enum: ["Active", "Inactive"], default: "Active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
