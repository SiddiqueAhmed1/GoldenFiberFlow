import DriverModel from "../Models/DriverModel.js";

// get driver
export const getDrivers = async (req, res) => {
  try {
    const drivers = await DriverModel.find().populate(
      "createdBy",
      "name email",
    );
    return res.status(200).json({
      message: "Drivers fetched successfully",
      success: true,
      error: false,
      data: drivers,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

// crate driver
export const createDriver = async (req, res) => {
  const { name, mobile, licenseNumber, licenseExpiry, address, status } =
    req.body;
  const userId = req.user.id;
  try {
    if (!name || !mobile || !licenseNumber || !licenseExpiry || !address) {
      return res.status(400).json({
        message: "All required fields must be filled",
        success: false,
        error: true,
      });
    }
    const existing = await DriverModel.findOne({ licenseNumber });
    if (existing)
      return res.status(400).json({
        message: "A driver with this license already exists",
        success: false,
        error: true,
      });
    const driver = new DriverModel({
      name,
      mobile,
      licenseNumber,
      licenseExpiry,
      address,
      status,
      createdBy: userId,
    });
    await driver.save();
    await driver.populate("createdBy", "name email");
    return res.status(201).json({
      message: "Driver created successfully",
      success: true,
      error: false,
      data: driver,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await DriverModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("createdBy", "name email");
    if (!driver)
      return res
        .status(404)
        .json({ message: "Driver not found", success: false, error: true });
    return res.status(200).json({
      message: "Driver updated successfully",
      success: true,
      error: false,
      data: driver,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

// delete driver
export const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DriverModel.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Driver not found", success: false, error: true });
    return res.status(200).json({
      message: "Driver deleted successfully",
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
