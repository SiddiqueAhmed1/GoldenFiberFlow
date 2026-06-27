import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import { createPurchaseOrder, deletePurchaseOrder, getPurchaseOrders, updatePurchaseOrder } from "../Controller/purchaseOrderController.js";
const router = express.Router();
router.get("/purchase-order", authMiddleware, getPurchaseOrders);
router.post("/purchase-order", authMiddleware, createPurchaseOrder);
router.patch("/purchase-order/:id", authMiddleware, updatePurchaseOrder);
router.delete("/purchase-order/:id", authMiddleware, deletePurchaseOrder);
export default router;
