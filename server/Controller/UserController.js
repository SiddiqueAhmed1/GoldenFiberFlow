import UserModel from "../Models/UserModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import generateAccessToken from "../Utils/generateAccessToken.js";
import generateRefreshToken from "../Utils/generateRefreshToken.js";
import ConsignmentModel from "../Models/ConsignmentModel.js";

// create user
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // form data check
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are requrired" });
  }

  // email check
  const isEmail = validator.isEmail(email);
  if (!isEmail) {
    return res.status(400).json({
      message: "Email is wrong",
    });
  }

  // check user existence
  const existUser = await UserModel.findOne({ email });
  if (existUser) {
    return res.status(500).json({
      message: "User already exist",
      success: false,
      error: true,
    });
  }

  // password length check
  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be 6 or more characters",
    });
  }

  // password hash
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);

  const user = {
    name,
    email,
    password: hashPass,
    role,
  };

  // create user
  const userData = await UserModel.create(user);

  if (userData) {
    return res.status(201).json({
      message: "User created succesfull",
      success: true,
      error: false,
      data: userData,
    });
  }
};

// get all user
export const getUser = async (req, res) => {
  try {
    const data = await UserModel.find();

    return res.status(200).json({
      message: "User get succesfull",
      success: true,
      error: false,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

// user delete
export const userdelete = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        message: "User id not found",
        success: false,
        error: true,
      });
    }

    //delete consignment
    const deletedItem = await ConsignmentModel.deleteMany({
      createdBy: id,
    });

    // check user in db and delete
    const deletedUser = await UserModel.findOneAndDelete({ _id: id });
    if (!deletedUser) {
      return res.status(400).json({
        message: "User not deleted",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "User deleted successfull",
      success: true,
      error: false,
      data: deletedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};
