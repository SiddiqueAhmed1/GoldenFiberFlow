import ProductModel from "../Models/ProductModel.js";
import InventoryModel from "../Models/InventoryModel.js";

export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate(
      "createdBy",
      "name email",
    );
    return res
      .status(200)
      .json({
        message: "Products fetched successfully",
        success: true,
        error: false,
        data: products,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const createProduct = async (req, res) => {
  const { name, sku, grade, unitPrice, unit, status } = req.body;
  const userId = req.user.id;
  try {
    if (!name || !sku || !grade || !unitPrice) {
      return res
        .status(400)
        .json({
          message: "Name, SKU, grade and unit price are required",
          success: false,
          error: true,
        });
    }
    const existing = await ProductModel.findOne({ sku: sku.toUpperCase() });
    if (existing)
      return res
        .status(400)
        .json({
          message: "A product with this SKU already exists",
          success: false,
          error: true,
        });

    const product = new ProductModel({
      name,
      sku,
      grade,
      unitPrice,
      unit,
      status,
      createdBy: userId,
    });
    await product.save();
    await product.populate("createdBy", "name email");
    return res
      .status(201)
      .json({
        message: "Product created successfully",
        success: true,
        error: false,
        data: product,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("createdBy", "name email");
    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found", success: false, error: true });
    return res
      .status(200)
      .json({
        message: "Product updated successfully",
        success: true,
        error: false,
        data: product,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check inventory stock before deleting
    const inventory = await InventoryModel.findOne({ product: id });
    if (inventory && inventory.currentStock > 0) {
      return res.status(400).json({
        message: `Cannot delete. This product has ${inventory.currentStock} ${inventory.unit} in stock. Clear the stock first.`,
        success: false,
        error: true,
      });
    }

    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Product not found", success: false, error: true });

    // Delete inventory row if exists (stock is 0 or no record)
    await InventoryModel.findOneAndDelete({ product: id });

    return res
      .status(200)
      .json({
        message: "Product deleted successfully",
        success: true,
        error: false,
        data: deleted,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

// Bulk import products from Excel
export const bulkImportProducts = async (req, res) => {
  const { products } = req.body;
  const userId = req.user.id;
  try {
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "No products provided", success: false, error: true });
    }

    const results = { created: 0, skipped: 0, errors: [] };

    for (const row of products) {
      const { name, sku, grade, unitPrice, unit, status } = row;
      if (!name || !sku || !grade || !unitPrice) {
        results.errors.push(
          `Row skipped — missing required fields: ${JSON.stringify(row)}`,
        );
        results.skipped++;
        continue;
      }
      const existing = await ProductModel.findOne({
        sku: String(sku).toUpperCase(),
      });
      if (existing) {
        results.errors.push(`SKU "${sku}" already exists — skipped`);
        results.skipped++;
        continue;
      }
      await ProductModel.create({
        name,
        sku: String(sku).toUpperCase(),
        grade,
        unitPrice: Number(unitPrice),
        unit: unit || "kg",
        status: status || "Active",
        createdBy: userId,
      });
      results.created++;
    }

    return res
      .status(200)
      .json({
        message: `Import complete. ${results.created} created, ${results.skipped} skipped.`,
        success: true,
        error: false,
        data: results,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};
