import mongoose from "mongoose";

const purchaseOrderSchema = mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    supplier:    { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    items: [
      {
        product:    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        description:{ type: String, required: true },
        quantity:   { type: Number, required: true },
        unitPrice:  { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Received", "Cancelled"],
      default: "Pending",
    },
    expectedDate: { type: Date },
    note:         { type: String, default: "" },
    createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

purchaseOrderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const count = await mongoose.model("PurchaseOrder").countDocuments();
    this.orderNumber = `PO-${String(count + 1).padStart(5, "0")}`;
  }
});

export default mongoose.model("PurchaseOrder", purchaseOrderSchema);
