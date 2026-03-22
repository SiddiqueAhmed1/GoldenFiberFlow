import ConsignmentModel from "../Models/ConsignmentModel.js";

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
