import UserModel from "../Models/UserModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import generateAccessToken from "../Utils/generateAccessToken.js";
import generateRefreshToken from "../Utils/generateRefreshToken.js";

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

// user login
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(500).json({
        message: "All fields are required",
      });
    }

    // check user
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      return res.status(500).json({
        message: "Wrong email",
        success: false,
        error: true,
      });
    }

    // compare password with db
    const passCheck = await bcrypt.compare(password, userExist.password);
    if (!passCheck) {
      return res.status(500).json({
        message: "Password is wrong",
      });
    }

    // generate token
    const accessToken = await generateAccessToken(userExist._id);
    const refreshToken = await generateRefreshToken(userExist._id);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // send success response
    res.status(200).json({
      message: "Login successfully done",
      success: true,
      error: false,
      data: userExist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// logout
export const userLogout = async (req, res) => {
  try {
    const userId = req.user._id;
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    // update refresh Token
    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });

    res.status(200).json({
      message: "User logged out succesfull",
      success: true,
      error: false,
      data: removeRefreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
