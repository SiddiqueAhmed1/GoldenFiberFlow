import express from "express";
import multer from "multer"; // Import multer for file uploading
import authMiddleware from "../Utils/authMiddleware.js";
import {
  createSupplier,
  deleteSupplier,
  getSingleSupplier,
  getSuppliers,
  updateSupplier,
  uploadSuppliersExcel, // Import the new controller function
} from "../Controller/supplierController.js";

// Multer configuration: Stores files in memory as a buffer
const upload = multer({ storage: multer.memoryStorage() });

// Initialize router
const router = express.Router();

// Existing endpoints
router.post("/supplier", authMiddleware, createSupplier);
router.get("/supplier", authMiddleware, getSuppliers);
router.get("/supplier/:id", authMiddleware, getSingleSupplier);
router.patch("/supplier/:id", authMiddleware, updateSupplier);
router.delete("/supplier/:id", authMiddleware, deleteSupplier);

// New excel upload endpoint protected by authMiddleware
router.post(
  "/supplier/upload-excel",
  authMiddleware,
  upload.single("file"),
  uploadSuppliersExcel,
);

export default router;
