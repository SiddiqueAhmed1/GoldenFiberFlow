import ConsignmentModel from "../Models/ConsignmentModel.js";
import UserModel from "../Models/UserModel.js";

// get all consignment
export const getConsignment = async (req, res) => {
  try {
    const getUser = await UserModel.findOne({ _id: req.user.id });
    let consignment;

    if (getUser.role === "Admin") {
      consignment = await ConsignmentModel.find().populate(
        "createdBy",
        "name email",
      );
    } else {
      consignment = await ConsignmentModel.find({ createdBy: req.user.id });
    }

    return res.status(200).json({
      message: "Consignment get succesfull",
      success: true,
      error: false,
      data: consignment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// create consginment
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
      return res.status(401).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    // add consignment to db
    const consignment = await ConsignmentModel.create({
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
        trackDetails: transportation_details.trackDetails,
        driverName: transportation_details.driverName,
      },
      items: items,
      status,
      createdBy: userId,
    });

    return res.status(201).json({
      message: "Consignment create successfull",
      success: true,
      error: false,
      data: consignment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: true,
      error: false,
    });
  }
};

// delete consignment
export const deleteConsignment = async (req, res) => {
  try {
    const { id } = req.params;

    // delete
    const deletedConsignment = await ConsignmentModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Consignment deleted succesfull",
      success: true,
      error: false,
      data: deletedConsignment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: true,
      error: false,
    });
  }
};

// get single consignment
export const singleConsignment = async (req, res) => {
  try {
    const { id } = req.params;

    // get consignment form db
    const consignment = await ConsignmentModel.findById(id);

    return res.status(200).json({
      message: "Consignment get successfull",
      success: true,
      error: false,
      data: consignment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error || error.message,
      success: false,
      error: true,
    });
  }
};
