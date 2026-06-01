import WarehouseModel from "../Models/WarehouseModel.js";

export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await WarehouseModel.find().populate(
      "createdBy",
      "name email",
    );
    return res
      .status(200)
      .json({
        message: "Warehouses fetched successfully",
        success: true,
        error: false,
        data: warehouses,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const createWarehouse = async (req, res) => {
  const { name, location, capacity, manager, mobile, status } = req.body;
  const userId = req.user.id;
  try {
    if (!name || !location || !capacity || !manager || !mobile) {
      return res
        .status(400)
        .json({
          message: "All required fields must be filled",
          success: false,
          error: true,
        });
    }
    const warehouse = new WarehouseModel({
      name,
      location,
      capacity,
      manager,
      mobile,
      status,
      createdBy: userId,
    });
    await warehouse.save();
    await warehouse.populate("createdBy", "name email");
    return res
      .status(201)
      .json({
        message: "Warehouse created successfully",
        success: true,
        error: false,
        data: warehouse,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await WarehouseModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("createdBy", "name email");
    if (!warehouse)
      return res
        .status(404)
        .json({ message: "Warehouse not found", success: false, error: true });
    return res
      .status(200)
      .json({
        message: "Warehouse updated successfully",
        success: true,
        error: false,
        data: warehouse,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await WarehouseModel.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Warehouse not found", success: false, error: true });
    return res
      .status(200)
      .json({
        message: "Warehouse deleted successfully",
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
