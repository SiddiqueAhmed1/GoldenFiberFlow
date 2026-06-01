import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import {
  createWarehouse,
  deleteWarehouse,
  getWarehouses,
  updateWarehouse,
} from "../Controller/warehouseController.js";
const router = express.Router();
router.get("/warehouse", authMiddleware, getWarehouses);
router.post("/warehouse", authMiddleware, createWarehouse);
router.patch("/warehouse/:id", authMiddleware, updateWarehouse);
router.delete("/warehouse/:id", authMiddleware, deleteWarehouse);
export default router;
