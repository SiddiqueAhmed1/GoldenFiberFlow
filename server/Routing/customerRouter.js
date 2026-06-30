import { bulkImportCustomers } from "../Controller/customerController.js";
import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "../Controller/customerController.js";
const router = express.Router();
router.get("/customer", authMiddleware, getCustomers);
router.post("/customer", authMiddleware, createCustomer);
router.patch("/customer/:id", authMiddleware, updateCustomer);
router.delete("/customer/:id", authMiddleware, deleteCustomer);
router.post("/customer/bulk-import", authMiddleware, bulkImportCustomers);
export default router;
