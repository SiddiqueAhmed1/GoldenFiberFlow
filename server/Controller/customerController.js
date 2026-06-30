import CustomerModel from "../Models/CustomerModel.js";

export const getCustomers = async (req, res) => {
  try {
    const customers = await CustomerModel.find().populate(
      "createdBy",
      "name email",
    );
    return res
      .status(200)
      .json({
        message: "Customers fetched successfully",
        success: true,
        error: false,
        data: customers,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const createCustomer = async (req, res) => {
  const { name, mobile, email, address, businessName, status } = req.body;
  const userId = req.user.id;
  try {
    if (!name || !mobile || !address) {
      return res
        .status(400)
        .json({
          message: "Name, mobile and address are required",
          success: false,
          error: true,
        });
    }
    const customer = new CustomerModel({
      name,
      mobile,
      email,
      address,
      businessName,
      status,
      createdBy: userId,
    });
    await customer.save();
    await customer.populate("createdBy", "name email");
    return res
      .status(201)
      .json({
        message: "Customer created successfully",
        success: true,
        error: false,
        data: customer,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await CustomerModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("createdBy", "name email");
    if (!customer)
      return res
        .status(404)
        .json({ message: "Customer not found", success: false, error: true });
    return res
      .status(200)
      .json({
        message: "Customer updated successfully",
        success: true,
        error: false,
        data: customer,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CustomerModel.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Customer not found", success: false, error: true });
    return res
      .status(200)
      .json({
        message: "Customer deleted successfully",
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

// Bulk import customers from Excel

export const bulkImportCustomers = async (req, res) => {
  const { customers } = req.body;
  const userId = req.user.id;
  try {
    if (!Array.isArray(customers) || customers.length === 0) {
      return res
        .status(400)
        .json({
          message: "No customers provided",
          success: false,
          error: true,
        });
    }

    const results = { created: 0, skipped: 0, errors: [] };

    for (const row of customers) {
      const { name, mobile, email, address, businessName, status } = row;
      if (!name || !mobile || !address) {
        results.errors.push(
          `Row skipped — missing required fields: ${JSON.stringify(row)}`,
        );
        results.skipped++;
        continue;
      }
      if (email) {
        const existing = await CustomerModel.findOne({ email });
        if (existing) {
          results.errors.push(`Email "${email}" already exists — skipped`);
          results.skipped++;
          continue;
        }
      }
      await CustomerModel.create({
        name,
        mobile,
        email: email || "",
        address,
        businessName: businessName || "",
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
