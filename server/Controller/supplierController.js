import SupplierModel from "../Models/SupplierModel.js";

// get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await SupplierModel.find().populate(
      "createdBy",
      "name email",
    );

    return res.status(200).json({
      message: "Suppliers fetched successfully",
      success: true,
      error: false,
      data: suppliers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// create supplier
export const createSupplier = async (req, res) => {
  const { name, contactPerson, mobile, email, address, paymentTerms, status } =
    req.body;
  const userId = req.user.id;

  try {
    if (!name || !contactPerson || !mobile || !email || !address) {
      return res.status(400).json({
        message: "All required fields must be filled",
        success: false,
        error: true,
      });
    }

    // check if supplier email already exists
    const existingSupplier = await SupplierModel.findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({
        message: "A supplier with this email already exists",
        success: false,
        error: true,
      });
    }

    const supplier = new SupplierModel({
      name,
      contactPerson,
      mobile,
      email,
      address,
      paymentTerms,
      status,
      createdBy: userId,
    });

    await supplier.save();
    await supplier.populate("createdBy", "name email");

    return res.status(201).json({
      message: "Supplier created successfully",
      success: true,
      error: false,
      data: supplier,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// update supplier
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await SupplierModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("createdBy", "name email");

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Supplier updated successfully",
      success: true,
      error: false,
      data: supplier,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// delete supplier
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSupplier = await SupplierModel.findByIdAndDelete(id);

    if (!deletedSupplier) {
      return res.status(404).json({
        message: "Supplier not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Supplier deleted successfully",
      success: true,
      error: false,
      data: deletedSupplier,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// get single supplier
export const getSingleSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await SupplierModel.findById(id).populate(
      "createdBy",
      "name email",
    );

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Supplier fetched successfully",
      success: true,
      error: false,
      data: supplier,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
