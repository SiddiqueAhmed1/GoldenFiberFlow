import ConsignmentModel from "../Models/ConsignmentModel.js";
import UserModel from "../Models/UserModel.js";

const populateConsignment = (query) =>
  query
    .populate("createdBy", "name email")
    .populate("transportation_details.driverId", "name licenseNumber")
    .populate("transportation_details.vehicleId", "plateNumber type");

// get all consignments
export const getConsignment = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.user.id });
    const query =
      user.role === "Admin"
        ? ConsignmentModel.find()
        : ConsignmentModel.find({ createdBy: req.user.id });

    const consignment = await populateConsignment(query);

    return res.status(200).json({
      message: "Consignment get successful",
      success: true,
      error: false,
      data: consignment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

// create consignment
export const createConsignment = async (req, res) => {
  const {
    sender_details,
    receiver_details,
    transportation_details,
    items,
    status,
  } = req.body;
  const userId = req.user.id;

  try {
    if (
      !sender_details ||
      !receiver_details ||
      !transportation_details ||
      !items ||
      !status
    ) {
      return res
        .status(400)
        .json({
          message: "All fields are required",
          success: false,
          error: true,
        });
    }

    const consignment = new ConsignmentModel({
      sender_details: {
        name: sender_details.name,
        address: sender_details.address,
        mobile: sender_details.mobile,
      },
      receiver_details: {
        name: receiver_details.name,
        address: receiver_details.address,
        mobile: receiver_details.mobile,
      },
      transportation_details: {
        driverId: transportation_details.driverId,
        vehicleId: transportation_details.vehicleId,
      },
      items,
      status,
      createdBy: userId,
    });

    await consignment.save();
    await populateConsignment(ConsignmentModel.findById(consignment._id)).then(
      (populated) => {
        Object.assign(consignment, populated.toObject());
      },
    );

    const result = await populateConsignment(
      ConsignmentModel.findById(consignment._id),
    );

    return res.status(201).json({
      message: "Consignment created successfully",
      success: true,
      error: false,
      data: result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

// update consignment
export const updateConsignment = async (req, res) => {
  try {
    const consignment = await populateConsignment(
      ConsignmentModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }),
    );

    if (!consignment) {
      return res
        .status(404)
        .json({
          message: "Consignment not found",
          success: false,
          error: true,
        });
    }

    return res.status(200).json({
      message: "Consignment updated successfully",
      success: true,
      error: false,
      data: consignment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

// delete consignment
export const deleteConsignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedConsignment = await ConsignmentModel.findByIdAndDelete(id);

    if (!deletedConsignment) {
      return res
        .status(404)
        .json({
          message: "Consignment not found",
          success: false,
          error: true,
        });
    }

    return res.status(200).json({
      message: "Consignment deleted successfully",
      success: true,
      error: false,
      data: deletedConsignment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

// get single consignment
export const singleConsignment = async (req, res) => {
  try {
    const { id } = req.params;
    const consignment = await populateConsignment(
      ConsignmentModel.findById(id),
    );

    if (!consignment) {
      return res
        .status(404)
        .json({
          message: "Consignment not found",
          success: false,
          error: true,
        });
    }

    return res.status(200).json({
      message: "Consignment get successful",
      success: true,
      error: false,
      data: consignment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
};
