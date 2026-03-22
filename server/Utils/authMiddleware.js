import jwt from "jsonwebtoken";
const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.accessToken || req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      res.status(500).json({
        message: "Provide token",
        success: false,
        error: true,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      res.status(500).json({
        message: "Unauthorized access",
        success: false,
        error: true,
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    res.status(500).json(error.message, error);
  }
};

export default authMiddleware;
