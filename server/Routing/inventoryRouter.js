import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import { adjustInventory, getInventory } from "../Controller/inventoryController.js";
const router = express.Router();
router.get("/inventory", authMiddleware, getInventory);
router.patch("/inventory/adjust", authMiddleware, adjustInventory);
export default router;
