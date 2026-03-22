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
      success: false,
      error: true,
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
  const { sender, receiver, items, status } = req.body;
  const userId = req.user.id;

  try {
    if (!sender || !receiver || !items || !status) {
      return res.status(500).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    // add consignment to db
    const consignment = await ConsignmentModel.create({
      sender_details: {
        name: sender.name,
        address: sender.address,
        mobile: sender.mobile,
      },
      receiver_details: {
        name: receiver.name,
        address: receiver.address,
        mobile: receiver.mobile,
      },
      items,
      status,
      createdBy: userId,
    });

    return res.status(200).json({
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
