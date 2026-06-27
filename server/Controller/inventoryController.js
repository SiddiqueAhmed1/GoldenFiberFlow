import InventoryModel from "../Models/InventoryModel.js";

export const getInventory = async (req, res) => {
  try {
    const inventory = await InventoryModel.find().populate("product", "name grade unit sku");
    return res.status(200).json({ message: "Inventory fetched", success: true, error: false, data: inventory });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
};

export const adjustInventory = async (req, res) => {
  const { productId, quantity, type } = req.body; // type: "add" | "subtract"
  try {
    if (!productId || !quantity || !type) {
      return res.status(400).json({ message: "productId, quantity and type are required", success: false, error: true });
    }
    const delta = type === "add" ? Number(quantity) : -Number(quantity);
    const inventory = await InventoryModel.findOneAndUpdate(
      { product: productId },
      { $inc: { currentStock: delta }, lastUpdated: Date.now() },
      { upsert: true, new: true }
    ).populate("product", "name grade unit sku");
    return res.status(200).json({ message: "Inventory adjusted", success: true, error: false, data: inventory });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
};
