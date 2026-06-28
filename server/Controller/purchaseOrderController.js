import PurchaseOrderModel from "../Models/PurchaseOrderModel.js";
import InventoryModel from "../Models/InventoryModel.js";

const populate = (q) =>
  q
    .populate("supplier", "name mobile")
    .populate("items.product", "name grade unit unitPrice")
    .populate("createdBy", "name email");

export const getPurchaseOrders = async (req, res) => {
  try {
    const orders = await populate(
      PurchaseOrderModel.find().sort({ createdAt: -1 }),
    );
    return res.status(200).json({
      message: "Purchase orders fetched",
      success: true,
      error: false,
      data: orders,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
};

export const createPurchaseOrder = async (req, res) => {
  const { supplier, items, totalAmount, expectedDate, note, status } = req.body;
  const userId = req.user.id;
  try {
    if (!supplier || !items || !items.length || !totalAmount) {
      return res.status(400).json({
        message: "Supplier, items and total amount are required",
        success: false,
        error: true,
      });
    }

    const order = new PurchaseOrderModel({
      supplier,
      items,
      totalAmount,
      expectedDate,
      note,
      status,
      createdBy: userId,
    });
    await order.save();

    // ✅ নতুন: create এর সময়ই যদি status "Received" হয়
    if (status === "Received") {
      for (const item of items) {
        await InventoryModel.findOneAndUpdate(
          { product: item.product },
          { $inc: { currentStock: item.quantity }, lastUpdated: Date.now() },
          { upsert: true, new: true },
        );
      }
    }

    const result = await populate(PurchaseOrderModel.findById(order._id));
    return res.status(201).json({
      message: "Purchase order created successfully",
      success: true,
      error: false,
      data: result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
};

export const updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await PurchaseOrderModel.findById(id);
    if (!existing)
      return res
        .status(404)
        .json({
          message: "Purchase order not found",
          success: false,
          error: true,
        });

    // ✅ Fix: req.body.items থেকে নাও, না থাকলে existing.items fallback
    const itemsToUse = req.body.items?.length ? req.body.items : existing.items;

    if (req.body.status === "Received" && existing.status !== "Received") {
      for (const item of itemsToUse) {
        await InventoryModel.findOneAndUpdate(
          { product: item.product },
          { $inc: { currentStock: item.quantity }, lastUpdated: Date.now() },
          { upsert: true, new: true },
        );
      }
    }

    const order = await populate(
      PurchaseOrderModel.findByIdAndUpdate(id, req.body, { new: true }),
    );
    return res
      .status(200)
      .json({
        message: "Purchase order updated successfully",
        success: true,
        error: false,
        data: order,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
};

export const deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PurchaseOrderModel.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({
        message: "Purchase order not found",
        success: false,
        error: true,
      });
    return res.status(200).json({
      message: "Purchase order deleted successfully",
      success: true,
      error: false,
      data: deleted,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
};
