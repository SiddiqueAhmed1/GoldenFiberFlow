import mongoose from "mongoose";

const inventorySchema = mongoose.Schema(
  {
    product:       { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
    currentStock:  { type: Number, default: 0 },
    unit:          { type: String, default: "kg" },
    lastUpdated:   { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
