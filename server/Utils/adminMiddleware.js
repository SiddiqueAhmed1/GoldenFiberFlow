import UserModel from "../Models/UserModel.js";

// check admin
export const adminMiddleware = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user || user.role !== "Admin") {
      return res.status(403).json({
        message: "Access restricted. Admins only.",
        success: false,
        error: true,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
