import mongoose from "mongoose";

const salesOrderSchema = mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    customer:    { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    items: [
      {
        product:     { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        description: { type: String, required: true },
        grade:       { type: String, required: true },
        quantity:    { type: Number, required: true },
        weight:      { type: Number, required: true },
        unitPrice:   { type: Number, required: true },
        totalPrice:  { type: Number, required: true },
      },
    ],
    totalAmount:   { type: Number, required: true },
    advanceAmount: { type: Number, default: 0 },
    dueAmount:     { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Transit", "Delivered", "Cancelled"],
      default: "Pending",
    },
    note:      { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// auto-generate order number before save
salesOrderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const count = await mongoose.model("SalesOrder").countDocuments();
    this.orderNumber = `SO-${String(count + 1).padStart(5, "0")}`;
  }
});

export default mongoose.model("SalesOrder", salesOrderSchema);
