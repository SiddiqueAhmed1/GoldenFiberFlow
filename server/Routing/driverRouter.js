import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import {
  createDriver,
  deleteDriver,
  getDrivers,
  updateDriver,
} from "../Controller/driverController.js";
const router = express.Router();
router.get("/driver", authMiddleware, getDrivers);
router.post("/driver", authMiddleware, createDriver);
router.patch("/driver/:id", authMiddleware, updateDriver);
router.delete("/driver/:id", authMiddleware, deleteDriver);
export default router;
