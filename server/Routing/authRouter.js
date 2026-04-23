import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import {
  registerUser,
  userLogin,
  userLogout,
} from "./../Controller/authController.js";

// init router
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", userLogin);
router.get("/logout", authMiddleware, userLogout);

export default router;
