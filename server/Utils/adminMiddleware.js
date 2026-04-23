import UserModel from "../Models/UserModel.js";

// check admin
export const adminMiddleware = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (user.role !== "Admin") {
      return res.status(500).json({
        message: "Access restricted",
        success: true,
        error: false,
        user,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: true,
      error: false,
    });
  }
};
