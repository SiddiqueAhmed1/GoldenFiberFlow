import UserModel from "../Models/UserModel.js";
import validator from "validator";
import bcrypt from "bcrypt";

// resgister user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // form data check
  if (!name || !email || !password) {
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
