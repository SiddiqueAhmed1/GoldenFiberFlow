import jwt from "jsonwebtoken";
const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.accessToken || req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
        success: false,
        error: true,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token expired or invalid",
      success: false,
      error: true,
    });
  }
};

// check admin
export const adminAuthMiddleware = (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "Admin") {
      return res.status(500).json({
        message: "Access restricted",
        success: true,
        error: false,
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

export default authMiddleware;
