import SalesOrderModel from "../Models/SalesOrderModel.js";
import InvoiceModel from "../Models/InvoiceModel.js";
import InventoryModel from "../Models/InventoryModel.js";

const populate = (q) =>
  q
    .populate("customer", "name mobile address businessName")
    .populate("items.product", "name grade unit unitPrice")
    .populate("dispatchDetails.driver", "name mobile")
    .populate("dispatchDetails.vehicle", "plateNumber type")
    .populate("dispatchDetails.warehouse", "name location")
    .populate("createdBy", "name email");

export const getSalesOrders = async (req, res) => {
  try {
    const orders = await populate(
      SalesOrderModel.find().sort({ createdAt: -1 }),
    );
    return res
      .status(200)
      .json({
        message: "Sales orders fetched",
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

export const createSalesOrder = async (req, res) => {
  const { customer, items, totalAmount, advanceAmount, note, status } =
    req.body;
  const userId = req.user.id;
  try {
    if (!customer || !items || !items.length || !totalAmount) {
      return res
        .status(400)
        .json({
          message: "Customer, items and total amount are required",
          success: false,
          error: true,
        });
    }
    const dueAmount = Number(totalAmount) - Number(advanceAmount || 0);

    // create sales order
    const order = new SalesOrderModel({
      customer,
      items,
      totalAmount: Number(totalAmount),
      advanceAmount: Number(advanceAmount || 0),
      dueAmount,
      note,
      status,
      createdBy: userId,
    });
    await order.save();

    // auto-create invoice for this sales order
    const invoiceStatus =
      dueAmount <= 0 ? "Paid" : advanceAmount > 0 ? "Partial" : "Unpaid";
    const invoice = new InvoiceModel({
      salesOrder: order._id,
      customer,
      totalAmount: Number(totalAmount),
      advanceAmount: Number(advanceAmount || 0),
      dueAmount,
      status: invoiceStatus,
      createdBy: userId,
    });
    await invoice.save();

    const result = await populate(SalesOrderModel.findById(order._id));
    return res
      .status(201)
      .json({
        message: "Sales order created successfully",
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

export const updateSalesOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await SalesOrderModel.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({
          message: "Sales order not found",
          success: false,
          error: true,
        });
    }

    // ১. হিসাবের ডাটা টাইপ ঠিক করা এবং বকেয়া (dueAmount) বের করা
    if (
      req.body.totalAmount !== undefined ||
      req.body.advanceAmount !== undefined
    ) {
      const total = Number(req.body.totalAmount ?? existing.totalAmount);
      const advance = Number(req.body.advanceAmount ?? existing.advanceAmount);
      req.body.dueAmount = total - advance;
    }

    // ২. স্ট্যাটাস Delivered হলে ইনভেন্টরি থেকে স্টক কমানো
    if (req.body.status === "Delivered" && existing.status !== "Delivered") {
      for (const item of existing.items) {
        await InventoryModel.findOneAndUpdate(
          { product: item.product },
          { $inc: { currentStock: -item.quantity }, lastUpdated: Date.now() },
          { upsert: true, new: true },
        );
      }
    }

    // ৩. সেলস অর্ডার ডাটাবেজে আপডেট করা
    const order = await populate(
      SalesOrderModel.findByIdAndUpdate(id, req.body, { new: true }),
    );

    // ৪. যদি ইনভয়েস থাকে, তবে সেটির অ্যামাউন্ট এবং পেমেন্ট স্ট্যাটাস সিঙ্ক করা
    const invoice = await InvoiceModel.findOne({ salesOrder: id });
    if (invoice) {
      invoice.totalAmount = order.totalAmount;
      invoice.advanceAmount = order.advanceAmount;
      invoice.dueAmount = order.dueAmount;
      invoice.status =
        order.dueAmount <= 0
          ? "Paid"
          : order.advanceAmount > 0
            ? "Partial"
            : "Unpaid";
      await invoice.save();
    }

    return res
      .status(200)
      .json({
        message: "Sales order updated successfully",
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

export const deleteSalesOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await InvoiceModel.deleteOne({ salesOrder: id }); // delete linked invoice
    const deleted = await SalesOrderModel.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({
          message: "Sales order not found",
          success: false,
          error: true,
        });
    return res
      .status(200)
      .json({
        message: "Sales order deleted successfully",
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

export const getSingleSalesOrder = async (req, res) => {
  try {
    const order = await populate(SalesOrderModel.findById(req.params.id));
    if (!order)
      return res
        .status(404)
        .json({
          message: "Sales order not found",
          success: false,
          error: true,
        });
    return res
      .status(200)
      .json({
        message: "Sales order fetched",
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
