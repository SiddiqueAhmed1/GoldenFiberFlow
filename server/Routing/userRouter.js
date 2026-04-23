import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import {
  createUser,
  getUser,
  userdelete,
} from "../Controller/UserController.js";
import { adminMiddleware } from "../Utils/adminMiddleware.js";

// init router
const router = express.Router();

router.post("/user", authMiddleware, adminMiddleware, createUser);
router.get("/user", authMiddleware, adminMiddleware, getUser);
router.delete("/user/:id", authMiddleware, userdelete);

export default router;
