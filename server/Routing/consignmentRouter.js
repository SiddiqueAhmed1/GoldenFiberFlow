import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import {
  createConsignment,
  deleteConsignment,
  getConsignment,
} from "../Controller/consignmentController.js";

// init router
const router = express.Router();

router.post("/createConsignment", authMiddleware, createConsignment);
router.get("/getConsignment", authMiddleware, getConsignment);
router.delete("/deleteConsignment/:id", authMiddleware, deleteConsignment);

export default router;
