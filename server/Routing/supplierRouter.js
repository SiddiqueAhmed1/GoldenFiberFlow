import express from "express";
import authMiddleware from "../Utils/authMiddleware.js";
import {
  createSupplier,
  deleteSupplier,
  getSingleSupplier,
  getSuppliers,
  updateSupplier,
} from "../Controller/supplierController.js";

// init router
const router = express.Router();

router.post("/supplier", authMiddleware, createSupplier);
router.get("/supplier", authMiddleware, getSuppliers);
router.get("/supplier/:id", authMiddleware, getSingleSupplier);
router.patch("/supplier/:id", authMiddleware, updateSupplier);
router.delete("/supplier/:id", authMiddleware, deleteSupplier);

export default router;
