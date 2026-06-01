import VehicleModel from "../Models/VehicleModel.js";

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await VehicleModel.find().populate(
      "createdBy",
      "name email",
    );
    return res
      .status(200)
      .json({
        message: "Vehicles fetched successfully",
        success: true,
        error: false,
        data: vehicles,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const createVehicle = async (req, res) => {
  const { plateNumber, type, capacity, status } = req.body;
  const userId = req.user.id;
  try {
    if (!plateNumber || !type || !capacity) {
      return res
        .status(400)
        .json({
          message: "All required fields must be filled",
          success: false,
          error: true,
        });
    }
    const existing = await VehicleModel.findOne({
      plateNumber: plateNumber.toUpperCase(),
    });
    if (existing)
      return res
        .status(400)
        .json({
          message: "A vehicle with this plate already exists",
          success: false,
          error: true,
        });
    const vehicle = new VehicleModel({
      plateNumber,
      type,
      capacity,
      status,
      createdBy: userId,
    });
    await vehicle.save();
    await vehicle.populate("createdBy", "name email");
    return res
      .status(201)
      .json({
        message: "Vehicle created successfully",
        success: true,
        error: false,
        data: vehicle,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await VehicleModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("createdBy", "name email");
    if (!vehicle)
      return res
        .status(404)
        .json({ message: "Vehicle not found", success: false, error: true });
    return res
      .status(200)
      .json({
        message: "Vehicle updated successfully",
        success: true,
        error: false,
        data: vehicle,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await VehicleModel.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Vehicle not found", success: false, error: true });
    return res
      .status(200)
      .json({
        message: "Vehicle deleted successfully",
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
