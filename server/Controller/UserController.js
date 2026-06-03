import UserModel from "../Models/UserModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import ConsignmentModel from "../Models/ConsignmentModel.js";

// create user
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const existUser = await UserModel.findOne({ email });
  if (existUser) {
    return res.status(409).json({
      message: "User with this email already exists",
      success: false,
      error: true,
    });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);

  const userData = await UserModel.create({
    name,
    email,
    password: hashPass,
    role,
  });

  if (userData) {
    return res.status(201).json({
      message: "User created successfully",
      success: true,
      error: false,
      data: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt,
      },
    });
  }
};

// get all users — excludes password and refresh token
export const getUser = async (req, res) => {
  try {
    const data = await UserModel.find().select("-password -refresh_token");

    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      error: false,
      data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
};

// delete user
export const userdelete = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: "User id not found", success: false, error: true });
    }

    // also delete their consignments
    await ConsignmentModel.deleteMany({ createdBy: id });

    const deletedUser = await UserModel.findOneAndDelete({ _id: id });
    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false, error: true });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
      error: false,
      data: deletedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, success: false, error: true });
  }
};
