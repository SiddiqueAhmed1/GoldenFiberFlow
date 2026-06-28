import SalesOrderModel from "../Models/SalesOrderModel.js";
import InvoiceModel from "../Models/InvoiceModel.js";
import InventoryModel from "../Models/InventoryModel.js";

const populate = (q) =>
  q.populate("customer", "name mobile address businessName")
   .populate("items.product", "name grade unit unitPrice")
   .populate("dispatchDetails.driver", "name mobile")
   .populate("dispatchDetails.vehicle", "plateNumber type")
   .populate("dispatchDetails.warehouse", "name location")
   .populate("createdBy", "name email");

export const getSalesOrders = async (req, res) => {
  try {
    const orders = await populate(SalesOrderModel.find().sort({ createdAt: -1 }));
    return res.status(200).json({ message: "Sales orders fetched", success: true, error: false, data: orders });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
};

export const createSalesOrder = async (req, res) => {
  const { customer, items, totalAmount, advanceAmount, note, status } = req.body;
  const userId = req.user.id;
  try {
    if (!customer || !items || !items.length || !totalAmount) {
      return res.status(400).json({ message: "Customer, items and total amount are required", success: false, error: true });
    }
    const advance = advanceAmount || 0;
    const dueAmount = totalAmount - advance;
    const order = new SalesOrderModel({ customer, items, totalAmount, advanceAmount: advance, dueAmount, note, status, createdBy: userId });
    await order.save();

    const invoiceStatus = dueAmount <= 0 ? "Paid" : advance > 0 ? "Partial" : "Unpaid";
    await InvoiceModel.create({
      salesOrder: order._id,
      customer,
      totalAmount,
      advanceAmount: advance,
      dueAmount,
      status: invoiceStatus,
      note: note || "",
      createdBy: userId,
    });

    const result = await populate(SalesOrderModel.findById(order._id));
    return res.status(201).json({ message: "Sales order created successfully", success: true, error: false, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
};

export const updateSalesOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await SalesOrderModel.findById(id);
    if (!existing) return res.status(404).json({ message: "Sales order not found", success: false, error: true });

    if (req.body.totalAmount !== undefined || req.body.advanceAmount !== undefined) {
      const total   = req.body.totalAmount   ?? existing.totalAmount;
      const advance = req.body.advanceAmount ?? existing.advanceAmount;
      req.body.dueAmount = total - advance;
    }

    // When status changes to Delivered → deduct inventory
    if (req.body.status === "Delivered" && existing.status !== "Delivered") {
      for (const item of existing.items) {
        await InventoryModel.findOneAndUpdate(
          { product: item.product },
          { $inc: { currentStock: -item.quantity }, lastUpdated: Date.now() },
          { upsert: true, new: true }
        );
      }
    }

    const order = await populate(SalesOrderModel.findByIdAndUpdate(id, req.body, { new: true }));
    return res.status(200).json({ message: "Sales order updated successfully", success: true, error: false, data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
};

export const deleteSalesOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SalesOrderModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Sales order not found", success: false, error: true });
    await InvoiceModel.deleteMany({ salesOrder: id });
    return res.status(200).json({ message: "Sales order deleted successfully", success: true, error: false, data: deleted });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
};

export const getSingleSalesOrder = async (req, res) => {
  try {
    const order = await populate(SalesOrderModel.findById(req.params.id));
    if (!order) return res.status(404).json({ message: "Sales order not found", success: false, error: true });
    return res.status(200).json({ message: "Sales order fetched", success: true, error: false, data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
};
