import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "../Controller/vehicleController.js";
const router = express.Router();
router.get("/vehicle", authMiddleware, getVehicles);
router.post("/vehicle", authMiddleware, createVehicle);
router.patch("/vehicle/:id", authMiddleware, updateVehicle);
router.delete("/vehicle/:id", authMiddleware, deleteVehicle);
export default router;
