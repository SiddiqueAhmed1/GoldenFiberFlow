import express from "express";
import {
  registerUser,
  userLogin,
  userLogout,
} from "../Controller/UserController.js";
import authMiddleware from "../Utils/authMiddleware.js";

// init router
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", userLogin);
router.get("/logout", authMiddleware, userLogout);

export default router;
