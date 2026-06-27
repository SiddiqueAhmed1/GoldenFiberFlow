import InvoiceModel from "../Models/InvoiceModel.js";

const populate = (q) =>
  q.populate("customer", "name mobile address businessName")
   .populate("salesOrder", "orderNumber totalAmount status")
   .populate("createdBy", "name email");

export const getInvoices = async (req, res) => {
  try {
    const invoices = await populate(InvoiceModel.find().sort({ createdAt: -1 }));
    return res.status(200).json({ message: "Invoices fetched", success: true, error: false, data: invoices });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
};

export const createInvoice = async (req, res) => {
  return res.status(403).json({
    message: "Invoices are created automatically when a sales order is placed",
    success: false,
    error: true,
  });
};

export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ["advanceAmount", "dueDate", "note", "status"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const existing = await InvoiceModel.findById(id);
    if (!existing) return res.status(404).json({ message: "Invoice not found", success: false, error: true });

    if (updates.advanceAmount !== undefined) {
      updates.dueAmount = existing.totalAmount - updates.advanceAmount;
      updates.status = updates.dueAmount <= 0 ? "Paid" : updates.advanceAmount > 0 ? "Partial" : "Unpaid";
    }

    const invoice = await populate(InvoiceModel.findByIdAndUpdate(id, updates, { new: true }));
    return res.status(200).json({ message: "Invoice updated successfully", success: true, error: false, data: invoice });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await InvoiceModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Invoice not found", success: false, error: true });
    return res.status(200).json({ message: "Invoice deleted successfully", success: true, error: false, data: deleted });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
};
