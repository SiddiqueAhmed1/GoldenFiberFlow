import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import {
  createConsignment,
  deleteConsignment,
  getConsignment,
  singleConsignment,
  updateConsignment,
} from "../Controller/consignmentController.js";

// init router
const router = express.Router();

router.post("/createConsignment", authMiddleware, createConsignment);
router.get("/getConsignment", authMiddleware, getConsignment);
router.delete("/deleteConsignment/:id", authMiddleware, deleteConsignment);
router.get("/singleConsignment/:id", authMiddleware, singleConsignment);
router.patch("/updateConsignment/:id", authMiddleware, updateConsignment);

export default router;
