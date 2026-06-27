import ProductModel from "../Models/ProductModel.js";

export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate("createdBy", "name email");
    return res.status(200).json({
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
      return res.status(400).json({
        message: "All required fields must be filled",
        success: false,
        error: true,
      });
    }
    const existing = await ProductModel.findOne({ sku: sku.toUpperCase() });
    if (existing)
      return res.status(400).json({
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
    return res.status(201).json({
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
    return res.status(200).json({
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
    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Product not found", success: false, error: true });
    return res.status(200).json({
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
