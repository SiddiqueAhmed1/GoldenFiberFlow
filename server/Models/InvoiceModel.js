import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    salesOrder:    { type: mongoose.Schema.Types.ObjectId, ref: "SalesOrder", required: true },
    customer:      { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    totalAmount:   { type: Number, required: true },
    advanceAmount: { type: Number, default: 0 },
    dueAmount:     { type: Number, default: 0 },
    status:        { type: String, enum: ["Unpaid", "Partial", "Paid"], default: "Unpaid" },
    dueDate:       { type: Date },
    note:          { type: String, default: "" },
    createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

invoiceSchema.pre("save", async function () {
  if (!this.invoiceNumber) {
    const count = await mongoose.model("Invoice").countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(5, "0")}`;
  }
});

export default mongoose.model("Invoice", invoiceSchema);
